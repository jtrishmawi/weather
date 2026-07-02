import type { MessageKey } from "@/i18n";

// Untranslated messages for Error.message (logs, debugging); the UI renders
// getGeoErrorMessageKey(error) through t() instead, so the text follows the
// app language even when the error object is cached.
const GEO_ERROR_MESSAGES: Record<number, string> = {
  1: "Location permission denied",
  2: "Your position could not be determined",
  3: "Locating you took too long",
};

const GEO_ERROR_KEYS: Record<number, MessageKey> = {
  0: "geoError.unsupported",
  1: "geoError.denied",
  2: "geoError.unavailable",
  3: "geoError.timeout",
};

export const getGeoErrorMessageKey = (error: unknown): MessageKey =>
  error instanceof GeolocationError
    ? (GEO_ERROR_KEYS[error.code] ?? "geoError.unavailable")
    : "geoError.unavailable";

class GeolocationError extends Error {
  // Mirrors GeolocationPositionError.code: 1 = denied, 2 = unavailable,
  // 3 = timeout. 0 means the browser has no geolocation support at all.
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.name = "GeolocationError";
    this.code = code;
  }
}

export const isPermissionDenied = (error: unknown) =>
  error instanceof GeolocationError && error.code === 1;

// Denied permission and missing browser support cannot resolve themselves;
// retrying only re-spams the browser.
export const isPermanentGeolocationError = (error: unknown) =>
  error instanceof GeolocationError && (error.code === 0 || error.code === 1);

export const fetchGeolocation = async (): Promise<GeolocationObject> => {
  return new Promise((resolve, reject) => {
    if (!("geolocation" in navigator)) {
      reject(new GeolocationError("Geolocation is not supported", 0));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          // Rounded to ~100 m so GPS jitter between reads doesn't produce a
          // new query key (and a full refetch) on every app load.
          latitude: Math.round(position.coords.latitude * 1000) / 1000,
          longitude: Math.round(position.coords.longitude * 1000) / 1000,
        }),
      (err) =>
        reject(
          new GeolocationError(
            GEO_ERROR_MESSAGES[err.code] ?? err.message,
            err.code,
          ),
        ),
      { timeout: 15000, maximumAge: 5 * 60 * 1000 },
    );
  });
};
