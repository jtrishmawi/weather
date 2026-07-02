// All date handling goes through the Temporal API (polyfilled until browsers
// ship it) and formats with the app's selected locale, not the browser's.
import { Temporal } from "temporal-polyfill";

const toInstant = (date: Date) =>
  Temporal.Instant.fromEpochMilliseconds(date.getTime());

// Formats in the system time zone, matching what new Date() rendering did.
export const formatDate = (
  date: Date,
  locale: string,
  options: Intl.DateTimeFormatOptions,
) => toInstant(date).toLocaleString(locale, options);

const RELATIVE_RANGES: Record<string, number> = {
  years: 3600 * 24 * 365,
  months: 3600 * 24 * 30,
  weeks: 3600 * 24 * 7,
  days: 3600 * 24,
  hours: 3600,
  minutes: 60,
  seconds: 1,
};

export const timeAgo = (date: Date, locale: string) => {
  // Temporal has no relative formatter of its own; it computes the delta and
  // Intl.RelativeTimeFormat renders it ("il y a 5 minutes", "قبل ٥ دقائق").
  const secondsElapsed = toInstant(date)
    .since(Temporal.Now.instant())
    .total("seconds");
  const formatter = new Intl.RelativeTimeFormat(locale);
  for (const [unit, seconds] of Object.entries(RELATIVE_RANGES)) {
    if (seconds <= Math.abs(secondsElapsed)) {
      return formatter.format(
        Math.round(secondsElapsed / seconds),
        unit as Intl.RelativeTimeFormatUnit,
      );
    }
  }
};
