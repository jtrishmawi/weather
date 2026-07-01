import { Button } from "@/components/ui/button";
import { cityLabel } from "@/hooks/use-cities";
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
  const [query, setQuery] = useState("");
  const inputId = useId();
  const errorId = useId();

  const search = useMutation({
    mutationFn: searchCities,
    onSuccess: (results, searched) => {
      announce(
        results.length === 0
          ? `No cities found for ${searched}`
          : `${results.length} result${results.length > 1 ? "s" : ""} for ${searched}`,
      );
    },
    onError: () => announce("City search failed"),
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed || search.isPending) return;
    announce("Searching…");
    search.mutate(trimmed);
  };

  const handleAdd = (city: City) => {
    onAdd(city);
    announce(`${cityLabel(city)} added to saved cities`);
  };

  return (
    <div className="space-y-3">
      <form role="search" onSubmit={handleSubmit} className="flex gap-2">
        <label htmlFor={inputId} className="sr-only">
          City name
        </label>
        <input
          id={inputId}
          ref={inputRef}
          type="text"
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
          Search
        </Button>
      </form>
      {search.isError && (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400">
          City search failed. Check your connection and try again.
        </p>
      )}
      {search.isSuccess && search.data.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No cities found for “{search.variables}”.
        </p>
      )}
      {search.isSuccess && search.data.length > 0 && (
        <ul aria-label="Search results" className="space-y-1">
          {search.data.map((city) =>
            addedIds.includes(city.id) ? (
              <li
                key={city.id}
                className="flex h-9 items-center justify-between gap-2 px-4 text-sm text-muted-foreground"
              >
                <span className="truncate">{cityLabel(city)}</span>
                <span className="flex items-center gap-1 shrink-0">
                  <CheckIcon
                    aria-hidden="true"
                    focusable="false"
                    className="size-4"
                  />
                  Added
                </span>
              </li>
            ) : (
              <li key={city.id}>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-normal"
                  onClick={() => handleAdd(city)}
                >
                  <span className="sr-only">Add </span>
                  {cityLabel(city)}
                </Button>
              </li>
            ),
          )}
        </ul>
      )}
    </div>
  );
};
