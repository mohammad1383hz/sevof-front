import { useEffect, useState } from "react";

export function useTypewriter(text: string, enabled: boolean, charsPerTick = 6, tickMs = 16) {
  const [count, setCount] = useState(enabled ? 0 : text.length);
  const done = count >= text.length;

  useEffect(() => {
    if (!enabled) {
      setCount(text.length);
      return;
    }
    setCount(0);
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) {
          clearInterval(id);
          return c;
        }
        return Math.min(c + charsPerTick, text.length);
      });
    }, tickMs);
    return () => clearInterval(id);
  }, [text, enabled, charsPerTick, tickMs]);

  return { visible: text.slice(0, count), done };
}
