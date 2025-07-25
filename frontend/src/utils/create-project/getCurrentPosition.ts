export interface GeoLocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface GeoLocationError {
  code: number;
  message: string;
}

export const getCurrentPosition = (): Promise<GeoLocationData> => {
  return new Promise((resolve, reject) => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      reject({
        code: 0,
        message: "Geolocation is not supported by this browser.",
      });
      return;
    }

    // Options for geolocation
    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000, // 10 seconds timeout
      maximumAge: 0, // Don't use cached position
    };

    // Get current position
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const geoData: GeoLocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        resolve(geoData);
      },
      (error: GeolocationPositionError) => {
        let errorMessage: string;

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied by user. Please enable location permissions in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "Location information is unavailable. Please check your device's location services.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
          default:
            errorMessage =
              "An unknown error occurred while retrieving location.";
            break;
        }

        reject({
          code: error.code,
          message: errorMessage,
        });
      },
      options
    );
  });
};

export const formatGeoLocation = (geoData: GeoLocationData): string => {
  // Format to 6 decimal places for good precision
  const lat = geoData.latitude.toFixed(6);
  const lng = geoData.longitude.toFixed(6);
  return `${lat}, ${lng}`;
};

export const parseGeoLocation = (geoString: string): GeoLocationData | null => {
  try {
    const parts = geoString.split(",").map((part) => part.trim());
    if (parts.length === 2) {
      const latitude = parseFloat(parts[0]);
      const longitude = parseFloat(parts[1]);

      if (!isNaN(latitude) && !isNaN(longitude)) {
        // Validate latitude and longitude ranges
        if (
          latitude >= -90 &&
          latitude <= 90 &&
          longitude >= -180 &&
          longitude <= 180
        ) {
          return {
            latitude,
            longitude,
            timestamp: Date.now(),
          };
        }
      }
    }
    return null;
  } catch {
    return null;
  }
};

export const isValidGeoLocation = (geoString: string): boolean => {
  return parseGeoLocation(geoString) !== null;
};
