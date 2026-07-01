import { CitySearch } from "@/components/city-search";
import { Button } from "@/components/ui/button";
import { announce } from "@/lib/announcer";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useEffect, useRef } from "react";

export type StepInfo = {
  status: "waiting" | "loading" | "complete" | "failed";
  error?: string;
  // Number of failed attempts in the current automatic-retry cycle.
  attempt?: number;
  onRetry?: () => void;
};

const StepIcon = ({ status }: { status: StepInfo["status"] }) => {
  switch (status) {
    case "loading":
      return (
        <Loader2
          aria-hidden="true"
          focusable="false"
          className="w-5 h-5 text-blue-500 motion-safe:animate-spin"
        />
      );
    case "complete":
      return (
        <CheckCircle
          aria-hidden="true"
          focusable="false"
          className="w-5 h-5 text-green-600 dark:text-green-500"
        />
      );
    case "failed":
      return (
        <XCircle
          aria-hidden="true"
          focusable="false"
          className="w-5 h-5 text-red-600 dark:text-red-400"
        />
      );
    default:
      return <div aria-hidden="true" className="w-5 h-5" />;
  }
};

const Step = ({ label, info }: { label: string; info: StepInfo }) => {
  // Announce transitions once, not states: a live region repeating "loading"
  // every render would drown the screen reader.
  const prevStatus = useRef(info.status);
  const prevAttempt = useRef(info.attempt ?? 0);
  useEffect(() => {
    if (prevStatus.current !== info.status) {
      prevStatus.current = info.status;
      if (info.status === "complete") announce(`${label} complete`);
      if (info.status === "failed")
        announce(`${label} failed${info.error ? `: ${info.error}` : ""}`);
    }
    const attempt = info.attempt ?? 0;
    if (attempt !== prevAttempt.current) {
      prevAttempt.current = attempt;
      if (attempt > 0 && info.status === "loading") {
        announce(`${label} request failed, retrying — attempt ${attempt + 1}`);
      }
    }
  }, [info.status, info.error, info.attempt, label]);

  const attempt = info.attempt ?? 0;

  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <StepIcon status={info.status} />
        <span>
          {label}
          <span className="sr-only">
            : {info.status}
            {info.status === "loading" && attempt > 0
              ? `, retry attempt ${attempt + 1}`
              : ""}
          </span>
        </span>
        {info.status === "loading" && attempt > 0 && (
          <span aria-hidden="true" className="text-sm text-muted-foreground">
            retrying (attempt {attempt + 1})
          </span>
        )}
      </div>
      {info.status === "failed" && (
        <div className="ml-7 flex flex-col items-start gap-2">
          {info.error && (
            <span className="text-sm text-red-600 dark:text-red-400">
              {info.error}
            </span>
          )}
          {info.onRetry && (
            <Button variant="outline" size="sm" onClick={info.onRetry}>
              Retry {label.toLowerCase()}
            </Button>
          )}
        </div>
      )}
    </li>
  );
};

export const LoadingScreen = ({
  geolocation,
  weather,
  geoDenied,
  onAddCity,
}: {
  geolocation: StepInfo;
  weather: StepInfo;
  geoDenied: boolean;
  onAddCity: (city: City) => void;
}) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fallbackHeadingRef = useRef<HTMLHeadingElement>(null);
  const showCityFallback = geolocation.status === "failed";

  useEffect(() => {
    if (!showCityFallback) return;
    announce(
      geoDenied
        ? "Location permission denied. You can add a city manually instead."
        : "Your location is unavailable. You can add a city manually instead."
    );
    fallbackHeadingRef.current?.focus();
  }, [showCityFallback, geoDenied]);

  // When a failed block (Retry button, geo-denied search form) unmounts
  // because its step recovered, focus inside it is dropped on <body> —
  // rescue it to the heading.
  const prevFailed = useRef({
    geo: geolocation.status === "failed",
    weather: weather.status === "failed",
  });
  useEffect(() => {
    const prev = prevFailed.current;
    const now = {
      geo: geolocation.status === "failed",
      weather: weather.status === "failed",
    };
    prevFailed.current = now;
    const leftFailed = (prev.geo && !now.geo) || (prev.weather && !now.weather);
    if (leftFailed && document.activeElement === document.body) {
      headingRef.current?.focus();
    }
  }, [geolocation.status, weather.status]);

  return (
    <main className="w-full min-h-screen grid items-center justify-center px-4">
      <div className="p-6 bg-white dark:bg-gray-900 rounded-lg shadow space-y-4 w-full max-w-md">
        <h1
          ref={headingRef}
          tabIndex={-1}
          className="text-lg font-semibold outline-none"
        >
          Loading weather data
        </h1>
        <ol aria-label="Loading steps" className="space-y-3">
          <Step label="Geolocation" info={geolocation} />
          <Step label="Weather" info={weather} />
        </ol>
        {showCityFallback && (
          <section aria-labelledby="loading-add-city-heading" className="pt-2">
            <h2
              id="loading-add-city-heading"
              ref={fallbackHeadingRef}
              tabIndex={-1}
              className="text-base font-medium outline-none"
            >
              Add a city instead
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {geoDenied
                ? "Location permission was denied, so your local weather can't be shown. Search for a city to see its weather."
                : "Your location couldn't be determined. Search for a city to see its weather."}
            </p>
            <div className="mt-3">
              <CitySearch onAdd={onAddCity} />
            </div>
          </section>
        )}
      </div>
    </main>
  );
};
