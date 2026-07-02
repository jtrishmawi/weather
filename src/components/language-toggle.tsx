import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/hooks/use-language";
import { Languages } from "lucide-react";

// Endonyms on purpose: each option is readable to speakers of that language
// regardless of the current UI language. The per-item lang attribute makes
// screen readers pronounce each name with the matching voice.
const LANGUAGE_OPTIONS: { code: Lang; label: string }[] = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "ar", label: "العربية" },
];

export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages aria-hidden="true" className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t("language.toggle")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-401">
        <DropdownMenuRadioGroup
          value={lang}
          onValueChange={(next) => setLang(next as Lang)}
        >
          {LANGUAGE_OPTIONS.map(({ code, label }) => (
            <DropdownMenuRadioItem key={code} value={code} lang={code}>
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
