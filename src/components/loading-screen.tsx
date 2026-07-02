import { CitySearch } from "@/components/city-search";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import type { MessageKey } from "@/i18n";
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

const STATUS_KEYS: Record<StepInfo["status"], MessageKey> = {
  waiting: "loading.statusWaiting",
  loading: "loading.statusLoading",
  complete: "loading.statusComplete",
  failed: "loading.statusFailed",
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
  const { t, locale } = useLanguage();
  // Announce transitions once, not states: a live region repeating "loading"
  // every render would drown the screen reader.
  const prevStatus = useRef(info.status);
  const prevAttempt = useRef(info.attempt ?? 0);
  useEffect(() => {
    if (prevStatus.current !== info.status) {
      prevStatus.current = info.status;
      if (info.status === "complete")
        announce(t("loading.stepComplete", { label }));
      if (info.status === "failed")
        announce(
          info.error
            ? t("loading.stepFailedWithError", { label, error: info.error })
            : t("loading.stepFailed", { label }),
        );
    }
    const attempt = info.attempt ?? 0;
    if (attempt !== prevAttempt.current) {
      prevAttempt.current = attempt;
      if (attempt > 0 && info.status === "loading") {
        announce(t("loading.retryAnnounce", { label, attempt: attempt + 1 }));
      }
    }
  }, [info.status, info.error, info.attempt, label, t]);

  const attempt = info.attempt ?? 0;

  return (
    <li className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <StepIcon status={info.status} />
        <span>
          {label}
          <span className="sr-only">
            : {t(STATUS_KEYS[info.status])}
            {info.status === "loading" && attempt > 0
              ? t("loading.srRetry", { attempt: attempt + 1 })
              : ""}
          </span>
        </span>
        {info.status === "loading" && attempt > 0 && (
          <span aria-hidden="true" className="text-sm text-muted-foreground">
            {t("loading.retrying", { attempt: attempt + 1 })}
          </span>
        )}
      </div>
      {info.status === "failed" && (
        <div className="ms-7 flex flex-col items-start gap-2">
          {info.error && (
            <span className="text-sm text-red-600 dark:text-red-400">
              {info.error}
            </span>
          )}
          {info.onRetry && (
            <Button variant="outline" size="sm" onClick={info.onRetry}>
              {t("loading.retry", {
                label: label.toLocaleLowerCase(locale),
              })}
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
  const { t } = useLanguage();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const fallbackHeadingRef = useRef<HTMLHeadingElement>(null);
  const showCityFallback = geolocation.status === "failed";

  // The static index.html title is English; localize it while loading (App
  // takes over once weather data arrives). Matters in the geo-denied flow,
  // where this screen can stay up indefinitely.
  useEffect(() => {
    document.title = t("loading.title");
  }, [t]);

  useEffect(() => {
    if (!showCityFallback) return;
    announce(
      geoDenied
        ? t("loading.geoDeniedAnnounce")
        : t("loading.geoUnavailableAnnounce"),
    );
    fallbackHeadingRef.current?.focus();
  }, [showCityFallback, geoDenied, t]);

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
          {t("loading.title")}
        </h1>
        <ol aria-label={t("loading.steps")} className="space-y-3">
          <Step label={t("loading.stepGeolocation")} info={geolocation} />
          <Step label={t("loading.stepWeather")} info={weather} />
        </ol>
        {showCityFallback && (
          <section aria-labelledby="loading-add-city-heading" className="pt-2">
            <h2
              id="loading-add-city-heading"
              ref={fallbackHeadingRef}
              tabIndex={-1}
              className="text-base font-medium outline-none"
            >
              {t("loading.addCityInstead")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {geoDenied
                ? t("loading.geoDeniedHint")
                : t("loading.geoUnavailableHint")}
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
