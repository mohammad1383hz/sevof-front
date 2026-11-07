// src/i18n/rich.tsx
import React from "react";
import { t, type TVars } from "./index";

/**
 * Like `t()`, but placeholders may be filled with React elements, so translated
 * sentences can keep inline formatting, e.g.
 *   tx("auth.emailVerify.sentTo", { email: <b dir="ltr">{email}</b> })
 * Word order stays under the control of each language's copy.
 */
export function tx(key: string, parts: Record<string, React.ReactNode>, vars?: TVars): React.ReactNode {
  const template = t(key, vars);
  const chunks = template.split(/(\{\w+\})/g);
  return (
    <>
      {chunks.map((chunk, i) => {
        const m = /^\{(\w+)\}$/.exec(chunk);
        if (m && m[1] in parts) return <React.Fragment key={i}>{parts[m[1]]}</React.Fragment>;
        return <React.Fragment key={i}>{chunk}</React.Fragment>;
      })}
    </>
  );
}
