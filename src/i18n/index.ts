import { ar } from "@/i18n/ar";
import { en } from "@/i18n/en";
import { fr } from "@/i18n/fr";

export type MessageKey = keyof typeof en;
export type MessageParams = Record<string, string | number>;
// Base name of a pluralized message ("citySearch.results" for
// "citySearch.results.one" etc.); translatePlural appends the CLDR category
// picked by Intl.PluralRules.
export type PluralMessageKey = {
  [K in MessageKey]: K extends `${infer Base}.other` ? Base : never;
}[MessageKey];

const dictionaries: Record<Lang, Record<MessageKey, string>> = { en, fr, ar };

// "ar" alone defaults to Eastern Arabic-Indic digits (٠١٢٣); -u-nu-latn keeps
// Western digits so running text matches the charts and map, which always
// render 0-9.
export const LOCALES: Record<Lang, string> = {
  en: "en",
  fr: "fr",
  ar: "ar-u-nu-latn",
};

export const DIRECTIONS: Record<Lang, "ltr" | "rtl"> = {
  en: "ltr",
  fr: "ltr",
  ar: "rtl",
};

export const LANGUAGE_STORAGE_KEY = "weather-lang";

const isLang = (value: unknown): value is Lang =>
  value === "en" || value === "fr" || value === "ar";

export const detectLanguage = (): Lang => {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (isLang(stored)) return stored;
  for (const tag of navigator.languages ?? [navigator.language]) {
    const primary = tag?.split("-")[0];
    if (isLang(primary)) return primary;
  }
  return "en";
};

// Placeholders without a matching param are left verbatim, which is what
// splitAround relies on to find them.
const interpolate = (template: string, params?: MessageParams) =>
  params
    ? template.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in params ? String(params[name]) : match,
      )
    : template;

export const translate = (
  lang: Lang,
  key: MessageKey,
  params?: MessageParams,
) => interpolate(dictionaries[lang][key], params);

export const translatePlural = (
  lang: Lang,
  key: PluralMessageKey,
  count: number,
  params?: MessageParams,
) => {
  const category = new Intl.PluralRules(LOCALES[lang]).select(count);
  const dict = dictionaries[lang];
  const template =
    dict[`${key}.${category}` as MessageKey] ??
    dict[`${key}.other` as MessageKey];
  return interpolate(template, { count, ...params });
};

// For messages where a placeholder needs its own markup: returns the template
// text before and after the {name} placeholder, so the caller can render the
// value as a styled element between the two.
export const splitAround = (
  template: string,
  name: string,
): [string, string] => {
  const token = `{${name}}`;
  const index = template.indexOf(token);
  if (index === -1) return [template, ""];
  return [template.slice(0, index), template.slice(index + token.length)];
};
