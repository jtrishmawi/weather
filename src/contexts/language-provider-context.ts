import type {
  MessageKey,
  MessageParams,
  PluralMessageKey,
} from "@/i18n";
import { createContext } from "react";

export type LanguageProviderState = {
  lang: Lang;
  // BCP 47 tag for Intl APIs (Arabic carries -u-nu-latn for Western digits).
  locale: string;
  dir: "ltr" | "rtl";
  setLang: (lang: Lang) => void;
  t: (key: MessageKey, params?: MessageParams) => string;
  tp: (key: PluralMessageKey, count: number, params?: MessageParams) => string;
};

const initialState: LanguageProviderState = {
  lang: "en",
  locale: "en",
  dir: "ltr",
  setLang: () => null,
  t: (key) => key,
  tp: (key) => key,
};

export const LanguageProviderContext =
  createContext<LanguageProviderState>(initialState);
