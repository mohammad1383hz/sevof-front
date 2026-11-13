// src/components/ValueProposition.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { t } from "../i18n";

/* Large copy that lights up word by word on scroll (with inline video and animated SVGs) */

const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type MediaKey = "glass" | "pencil" | "google" | "chatgpt";

type MediaItem =
  | { type: "video"; src: string; className: string }
  | { type: "image"; src: string; className: string };

// {glass} {pencil} {google} {chatgpt} are media tokens; each one stays a standalone word in every language
const getValueLines = () => [
  t("landing.value.line1"),
  t("landing.value.line2"),
  t("landing.value.line3"),
];

// Files live directly in public/
const MEDIA: Record<MediaKey, MediaItem> = {
  glass: {
    type: "video",
    src: "/glass-final.webm",
    className: "inline-block w-14 h-14 md:w-20 md:h-20",
  },
  pencil: {
    type: "video",
    src: "/pencil-final.webm",
    className: "inline-block w-14 h-14 md:w-20 md:h-20 me-2",
  },
  google: {
    type: "image",
    src: "/google-animated.svg",
    className: "inline-block w-12 h-12 md:w-16 md:h-16 p-2 mb-2",
  },
  chatgpt: {
    type: "image",
    src: "/chatgpt-animated.svg",
    className: "inline-block w-12 h-12 md:w-16 md:h-16 p-2 mb-2",
  },
};

const InlineVideo: React.FC<{ src: string; className: string; reduced: boolean }> = ({
  src,
  className,
  reduced,
}) => {
  const vref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    // React doesn't set the muted attribute reliably, which blocks autoplay
    v.muted = true;
    if (reduced) return;
    v.play().catch(() => {});
  }, [reduced, src]);

  return (
    <video
      ref={vref}
      className={className}
      src={src}
      loop
      muted
      playsInline
      autoPlay={!reduced}
      preload="auto"
      aria-hidden="true"
    />
  );
};

const InlineMedia: React.FC<{ name: MediaKey; reduced: boolean }> = ({ name, reduced }) => {
  const m = MEDIA[name];
  if (!m) return null;

  if (m.type === "video") {
    return <InlineVideo src={m.src} className={m.className} reduced={reduced} />;
  }
  return <img src={m.src} alt="" className={m.className} />;
};

const useScrollProgress = (ref: React.RefObject<HTMLElement | null>) => {
  const [p, setP] = useState(0);
  useEffect(() => {
    if (prefersReducedMotion()) {
      setP(1);
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;

      const vh = window.innerHeight;
      const maxScroll = document.documentElement.scrollHeight - vh;
      const top = el.getBoundingClientRect().top;

      // Where the section top sits once the page is scrolled to the bottom
      const topAtEnd = top + window.scrollY - Math.max(maxScroll, 0);
      const topAtStart = vh * 0.85; // reveal starts here
      const range = topAtStart - topAtEnd;

      // Linear progress to the page bottom; the 1.15 factor lights every word slightly before the end
      const progress = range > 0 ? ((topAtStart - top) / range) * 1.15 : 1;
      setP(clamp(progress));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [ref]);
  return p;
};

const ValueProposition: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const scrubProgress = useScrollProgress(ref);
  const reduced = useMemo(() => prefersReducedMotion(), []);

  // Safety net: once the last line is on screen, every word is fully lit,
  // regardless of page height or scroll behaviour.
  const lastLineRef = useRef<HTMLHeadingElement>(null);
  const [lastLineVisible, setLastLineVisible] = useState(false);

  useEffect(() => {
    const el = lastLineRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setLastLineVisible(entry.isIntersecting && entry.intersectionRatio >= 0.6),
      { threshold: [0, 0.6, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const progress = lastLineVisible ? 1 : scrubProgress;

  const lines = useMemo(() => getValueLines().map((line) => line.split(" ").filter(Boolean)), []);
  const total = lines.reduce((s, l) => s + l.length, 0);
  let counter = 0;

  return (
    <section
      ref={ref}
      className="relative z-10 max-w-[700px] mx-auto px-2 py-16 sm:py-24"
      aria-label={t("landing.value.aria")}
    >
      <div className="space-y-8 md:space-y-16 text-center">
        {lines.map((words, li) => (
          <h2
            key={li}
            ref={li === lines.length - 1 ? lastLineRef : undefined}
            className="text-[24px] md:text-[44px] leading-[40px] md:leading-[56px] font-bold text-[#0D0F23]"
          >
            {words.map((w, wi) => {
              const i = counter++;
              const opacity = 0.18 + 0.82 * clamp(progress * (total + 3) - i);
              const mediaMatch = w.match(/^\{(\w+)\}$/);
              const style = { opacity, transition: "opacity 0.2s ease-out" };

              return (
                <React.Fragment key={wi}>
                  {mediaMatch ? (
                    <span className="inline-block align-middle mx-1" style={style}>
                      <InlineMedia name={mediaMatch[1] as MediaKey} reduced={reduced} />
                    </span>
                  ) : (
                    <span style={style}>{w}</span>
                  )}{" "}
                </React.Fragment>
              );
            })}
          </h2>
        ))}
      </div>
    </section>
  );
};

export default ValueProposition;