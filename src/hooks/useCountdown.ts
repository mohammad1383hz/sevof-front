import { useEffect, useRef, useState } from 'react';
import { t, formatNumber } from '../i18n';

/** Format a duration using Western numerals and compact English units. */
export function formatCountdown(totalSeconds: number): string {
  const clamped = Math.max(0, Math.floor(totalSeconds));
  const pad = (value: number) => value.toString().padStart(2, '0');

  const days = Math.floor(clamped / 86_400);
  const hours = Math.floor((clamped % 86_400) / 3_600);
  const minutes = Math.floor((clamped % 3_600) / 60);
  const seconds = clamped % 60;

  if (days > 0) return t("common.time.countdownDays", { days: formatNumber(days), hours: pad(hours), minutes: pad(minutes) });
  if (hours > 0) return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  return `${pad(minutes)}:${pad(seconds)}`;
}

/** Count down in seconds, restarting when the initial value changes. */
export function useCountdown(initialSeconds: number | null | undefined, onExpire?: () => void) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds ?? 0);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setSecondsLeft(initialSeconds ?? 0);
  }, [initialSeconds]);

  useEffect(() => {
    if ((initialSeconds ?? 0) <= 0) return;

    const id = setInterval(() => {
      setSecondsLeft((previous) => {
        if (previous <= 1) {
          clearInterval(id);
          onExpireRef.current?.();
          return 0;
        }
        return previous - 1;
      });
    }, 1_000);

    return () => clearInterval(id);
  }, [initialSeconds]);

  return secondsLeft;
}
