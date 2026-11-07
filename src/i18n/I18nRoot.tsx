// src/i18n/I18nRoot.tsx
import React from "react";
import { useLang } from "./index";

/**
 * Re-mounts its children whenever the interface language changes, so every
 * piece of text (including values computed in helpers and services) is
 * rendered again in the newly selected language.
 */
const I18nRoot: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const lang = useLang();
  return <React.Fragment key={lang}>{children}</React.Fragment>;
};

export default I18nRoot;
