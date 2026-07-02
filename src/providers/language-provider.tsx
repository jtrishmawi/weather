import {
  LanguageProviderContext,
  LanguageProviderState,
} from "@/contexts/language-provider-context";
import {
  detectLanguage,
  DIRECTIONS,
  LANGUAGE_STORAGE_KEY,
  LOCALES,
  translate,
  translatePlural,
} from "@/i18n";
import { announce, clearAnnouncements } from "@/lib/announcer";
import { useEffect, useMemo, useState } from "react";

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(detectLanguage);

  // Screen readers pick their voice from <html lang>, and rtl layout comes
  // from <html dir>. index.html applies both before first paint; this keeps
  // them in sync from then on.
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = DIRECTIONS[lang];
  }, [lang]);

  const value = useMemo<LanguageProviderState>(
    () => ({
      lang,
      locale: LOCALES[lang],
      dir: DIRECTIONS[lang],
      setLang: (next: Lang) => {
        if (next === lang) return;
        localStorage.setItem(LANGUAGE_STORAGE_KEY, next);
        // Order matters for screen readers: switch lang/dir first so the
        // right voice is active, drop queued messages in the old language,
        // then confirm the switch in the new language.
        document.documentElement.lang = next;
        document.documentElement.dir = DIRECTIONS[next];
        clearAnnouncements();
        setLangState(next);
        announce(translate(next, "language.changed"));
      },
      t: (key, params) => translate(lang, key, params),
      tp: (key, count, params) => translatePlural(lang, key, count, params),
    }),
    [lang],
  );

  return (
    <LanguageProviderContext.Provider value={value}>
      {children}
    </LanguageProviderContext.Provider>
  );
}
