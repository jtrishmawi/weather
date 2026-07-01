import { CitySearch } from "@/components/city-search";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cityLabel, GEO_CITY_ID } from "@/hooks/use-cities";
import { announce } from "@/lib/announcer";
import {
  ChevronDownIcon,
  MapPinIcon,
  SettingsIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useId, useRef, useState } from "react";

export type GeoStatus = "ready" | "locating" | "unavailable";

const GEO_STATUS_SUFFIX: Record<GeoStatus, string> = {
  ready: "",
  locating: " (locating…)",
  unavailable: " (unavailable)",
};

export const CitySwitcher = ({
  cities,
  selectedId,
  currentLabel,
  geoLabel,
  geoStatus,
  onSelect,
  onAdd,
  onRemove,
}: {
  cities: City[];
  selectedId: string;
  currentLabel: string;
  geoLabel: string;
  geoStatus: GeoStatus;
  onSelect: (id: string) => void;
  onAdd: (city: City) => void;
  onRemove: (id: string) => void;
}) => {
  const [panelOpen, setPanelOpen] = useState(false);
  // Set while the menu is closing because "Add or remove city…" was picked,
  // so the close-autofocus can be redirected from the trigger to the panel.
  const openingPanel = useRef(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const removeRefs = useRef(new Map<string, HTMLButtonElement>());
  const headingId = useId();
  const savedHeadingId = useId();

  const closePanel = () => {
    setPanelOpen(false);
    triggerRef.current?.focus();
  };

  const handleSelect = (id: string) => {
    onSelect(id);
    if (id === GEO_CITY_ID) {
      announce(
        geoStatus === "ready"
          ? `Showing weather for ${geoLabel}`
          : geoStatus === "locating"
            ? "Locating you…"
            : "Your location is unavailable. Retrying — allow location access in your browser."
      );
    } else {
      const city = cities.find((c) => c.id === id);
      if (city) announce(`Showing weather for ${cityLabel(city)}`);
    }
  };

  const handleRemove = (city: City, index: number) => {
    // Compute the focus target before the row unmounts: next city's remove
    // button, else the previous one's, else the panel heading.
    const neighbor = cities[index + 1] ?? cities[index - 1];
    onRemove(city.id);
    announce(`${cityLabel(city)} removed`);
    requestAnimationFrame(() => {
      if (neighbor) removeRefs.current.get(neighbor.id)?.focus();
      else headingRef.current?.focus();
    });
  };

  return (
    <div className="relative">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button ref={triggerRef} variant="outline">
            <MapPinIcon aria-hidden="true" focusable="false" />
            <span className="sr-only">Change city, currently: </span>
            <span className="max-w-40 truncate sm:max-w-64">{currentLabel}</span>
            <ChevronDownIcon aria-hidden="true" focusable="false" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="z-[401]"
          onCloseAutoFocus={(e) => {
            if (openingPanel.current) {
              openingPanel.current = false;
              e.preventDefault();
              searchInputRef.current?.focus();
            }
          }}
        >
          <DropdownMenuLabel>Cities</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={selectedId} onValueChange={handleSelect}>
            <DropdownMenuRadioItem value={GEO_CITY_ID}>
              {geoLabel}
              {geoStatus !== "ready" && (
                <span className="text-muted-foreground">
                  {GEO_STATUS_SUFFIX[geoStatus]}
                </span>
              )}
            </DropdownMenuRadioItem>
            {cities.map((city) => (
              <DropdownMenuRadioItem key={city.id} value={city.id}>
                {cityLabel(city)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => {
              openingPanel.current = true;
              setPanelOpen(true);
            }}
          >
            <SettingsIcon aria-hidden="true" focusable="false" />
            Add or remove city…
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {panelOpen && (
        <section
          aria-labelledby={headingId}
          onKeyDown={(e) => {
            if (e.key === "Escape") closePanel();
          }}
          className="fixed inset-x-2 top-16 z-[401] max-h-[min(70vh,28rem)] overflow-y-auto rounded-lg border bg-background p-4 shadow-lg sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 sm:max-w-[calc(100vw-1rem)]"
        >
          <div className="flex items-center justify-between gap-2">
            <h2
              id={headingId}
              ref={headingRef}
              tabIndex={-1}
              className="text-lg font-semibold outline-none"
            >
              Manage cities
            </h2>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Close manage cities panel"
              onClick={closePanel}
            >
              <XIcon aria-hidden="true" focusable="false" />
            </Button>
          </div>
          <div className="mt-3">
            <CitySearch
              onAdd={onAdd}
              addedIds={cities.map((c) => c.id)}
              inputRef={searchInputRef}
            />
          </div>
          {cities.length > 0 && (
            <div className="mt-4">
              <h3
                id={savedHeadingId}
                className="text-sm font-medium text-muted-foreground"
              >
                Saved cities
              </h3>
              <ul aria-labelledby={savedHeadingId} className="mt-1 space-y-1">
                {cities.map((city, index) => (
                  <li
                    key={city.id}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="truncate">{cityLabel(city)}</span>
                    <Button
                      ref={(el) => {
                        if (el) removeRefs.current.set(city.id, el);
                        else removeRefs.current.delete(city.id);
                      }}
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${cityLabel(city)}`}
                      onClick={() => handleRemove(city, index)}
                    >
                      <Trash2Icon aria-hidden="true" focusable="false" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
