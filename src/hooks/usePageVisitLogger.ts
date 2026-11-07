import { useEffect, useRef } from "react";
import { pageVisitService } from "../services/api";

const HEARTBEAT_INTERVAL_MS = 20_000;

export function usePageVisitLogger(page: string) {
  const visitIdRef = useRef<string | null>(null);
  const isStartingRef = useRef<boolean>(false);

  useEffect(() => {
    let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
    let isCancelled = false;

    // پایان ویزیت — فقط از طریق سرویس
    const sendEndRequest = (id: string) => {
      pageVisitService.end(id).catch(() => {});
    };

    const startVisit = async () => {
      if (isStartingRef.current || visitIdRef.current) return;
      isStartingRef.current = true;

      try {
        const res = await pageVisitService.start(page);

        if (res.success && res.data?.visit_id) {
          const visitId = res.data.visit_id;

          if (isCancelled) {
            sendEndRequest(visitId);
            return;
          }

          visitIdRef.current = visitId;

          heartbeatTimer = setInterval(() => {
            if (visitIdRef.current) {
              pageVisitService.heartbeat(visitIdRef.current).catch(() => {});
            }
          }, HEARTBEAT_INTERVAL_MS);
        }
      } catch {
        // silent
      } finally {
        isStartingRef.current = false;
      }
    };

    startVisit();

    const handleBeforeUnload = () => {
      if (visitIdRef.current) {
        sendEndRequest(visitIdRef.current);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && visitIdRef.current) {
        sendEndRequest(visitIdRef.current);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      isCancelled = true;

      if (heartbeatTimer) clearInterval(heartbeatTimer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      const id = visitIdRef.current;
      if (id) {
        visitIdRef.current = null;
        sendEndRequest(id);
      }
    };
  }, [page]);
}