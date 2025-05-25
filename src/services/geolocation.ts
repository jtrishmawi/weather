export const fetchGeolocation = async (): Promise<GeolocationObject> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      (err) => reject(err)
    );
  });
};
