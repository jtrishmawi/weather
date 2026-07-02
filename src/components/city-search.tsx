import { Button } from "@/components/ui/button";
import { cityLabel } from "@/hooks/use-cities";
import { useLanguage } from "@/hooks/use-language";
import { announce } from "@/lib/announcer";
import { searchCities } from "@/services/city-search";
import { useMutation } from "@tanstack/react-query";
import { CheckIcon, Loader2, SearchIcon } from "lucide-react";
import { useId, useState } from "react";

// Submit-based search (no live combobox): type a name, press Search, pick a
// result. Used by the manage-cities panel and by the loading screen's
// geolocation-denied fallback.
export const CitySearch = ({
  onAdd,
  addedIds = [],
  inputRef,
}: {
  onAdd: (city: City) => void;
  // Cities already saved: their result rows render as inert "Added" entries.
  addedIds?: string[];
  inputRef?: React.Ref<HTMLInputElement>;
}) => {
  const { t, tp, lang } = useLanguage();
  const [query, setQuery] = useState("");
  const inputId = useId();
  const errorId = useId();

  const search = useMutation({
    mutationFn: (name: string) => searchCities(name, lang),
    onSuccess: (results, searched) => {
      announce(
        results.length === 0
          ? t("citySearch.noResults", { query: searched })
          : tp("citySearch.results", results.length, { query: searched }),
      );
    },
    onError: () => announce(t("citySearch.failed")),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || search.isPending) return;
    announce(t("citySearch.searching"));
    search.mutate(trimmed);
  };

  const handleAdd = (city: City) => {
    onAdd(city);
    announce(t("citySearch.addedAnnounce", { city: cityLabel(city) }));
  };

  return (
    <div className="space-y-3">
      <form role="search" onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor={inputId} className="sr-only">
          {t("citySearch.label")}
        </label>
        <input
          id={inputId}
          ref={inputRef}
          type="text"
          // dir=auto: typed city names keep their own script's direction
          // (e.g. a Latin name typed in the Arabic UI).
          dir="auto"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoComplete="off"
          aria-describedby={search.isError ? errorId : undefined}
          className="h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] dark:bg-input/30 dark:border-input"
        />
        <Button
          type="submit"
          variant="outline"
          aria-disabled={search.isPending}
        >
          {search.isPending ? (
            <Loader2
              aria-hidden="true"
              className="motion-safe:animate-spin"
              focusable="false"
            />
          ) : (
            <SearchIcon aria-hidden="true" focusable="false" />
          )}
          {t("citySearch.search")}
        </Button>
      </form>
      {search.isError && (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400">
          {t("citySearch.failedHint")}
        </p>
      )}
      {search.isSuccess && search.data.length === 0 && (
        <p className="text-sm text-muted-foreground">
          {t("citySearch.noResults", { query: search.variables })}
        </p>
      )}
      {search.isSuccess && search.data.length > 0 && (
        <ul aria-label={t("citySearch.resultsLabel")} className="space-y-1">
          {search.data.map((city) =>
            addedIds.includes(city.id) ? (
              <li
                key={city.id}
                className="flex h-9 items-center justify-between gap-2 px-4 text-sm text-muted-foreground"
              >
                <bdi className="truncate">{cityLabel(city)}</bdi>
                <span className="flex items-center gap-1 shrink-0">
                  <CheckIcon
                    aria-hidden="true"
                    focusable="false"
                    className="size-4"
                  />
                  {t("citySearch.added")}
                </span>
              </li>
            ) : (
              <li key={city.id}>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-normal"
                  onClick={() => handleAdd(city)}
                >
                  <span className="sr-only">{t("citySearch.addPrefix")}</span>
                  <bdi>{cityLabel(city)}</bdi>
                </Button>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
};
