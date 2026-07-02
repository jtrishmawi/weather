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
import { useLanguage } from "@/hooks/use-language";
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
  const { t } = useLanguage();
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
          ? t("citySwitcher.showingWeatherFor", { city: geoLabel })
          : geoStatus === "locating"
            ? t("citySwitcher.locatingYou")
            : t("citySwitcher.locationUnavailableRetry"),
      );
    } else {
      const city = cities.find((c) => c.id === id);
      if (city)
        announce(t("citySwitcher.showingWeatherFor", { city: cityLabel(city) }));
    }
  };

  const handleRemove = (city: City, index: number) => {
    // Compute the focus target before the row unmounts: next city's remove
    // button, else the previous one's, else the panel heading.
    const neighbor = cities[index + 1] ?? cities[index - 1];
    onRemove(city.id);
    announce(t("citySwitcher.removed", { city: cityLabel(city) }));
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
            <span className="sr-only">{t("citySwitcher.changeCity")}</span>
            <bdi className="max-w-24 truncate min-[480px]:max-w-40 sm:max-w-64">
              {currentLabel}
            </bdi>
            <ChevronDownIcon aria-hidden="true" focusable="false" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="z-401"
          onCloseAutoFocus={(e) => {
            if (openingPanel.current) {
              openingPanel.current = false;
              e.preventDefault();
              searchInputRef.current?.focus();
            }
          }}
        >
          <DropdownMenuLabel>{t("citySwitcher.cities")}</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={selectedId}
            onValueChange={handleSelect}
          >
            <DropdownMenuRadioItem value={GEO_CITY_ID}>
              <bdi>{geoLabel}</bdi>
              {geoStatus !== "ready" && (
                <span className="text-muted-foreground">
                  {" "}
                  {t(
                    geoStatus === "locating"
                      ? "citySwitcher.locating"
                      : "citySwitcher.unavailable",
                  )}
                </span>
              )}
            </DropdownMenuRadioItem>
            {cities.map((city) => (
              <DropdownMenuRadioItem key={city.id} value={city.id}>
                <bdi>{cityLabel(city)}</bdi>
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
            {t("citySwitcher.manage")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {panelOpen && (
        <section
          aria-labelledby={headingId}
          onKeyDown={(e) => {
            if (e.key === "Escape") closePanel();
          }}
          className="fixed inset-x-2 top-16 z-401 max-h-[min(70vh,28rem)] overflow-y-auto rounded-lg border bg-background p-4 shadow-lg sm:absolute sm:inset-x-auto sm:inset-e-0 sm:top-full sm:mt-2 sm:w-96 sm:max-w-[calc(100vw-1rem)]"
        >
          <div className="flex items-center justify-between gap-2">
            <h2
              id={headingId}
              ref={headingRef}
              tabIndex={-1}
              className="text-lg font-semibold outline-none"
            >
              {t("citySwitcher.manageHeading")}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              aria-label={t("citySwitcher.closePanel")}
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
                {t("citySwitcher.saved")}
              </h3>
              <ul aria-labelledby={savedHeadingId} className="mt-1 space-y-1">
                {cities.map((city, index) => (
                  <li
                    key={city.id}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <bdi className="truncate">{cityLabel(city)}</bdi>
                    <Button
                      ref={(el) => {
                        if (el) removeRefs.current.set(city.id, el);
                        else removeRefs.current.delete(city.id);
                      }}
                      variant="ghost"
                      size="icon"
                      aria-label={t("citySwitcher.remove", {
                        city: cityLabel(city),
                      })}
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
