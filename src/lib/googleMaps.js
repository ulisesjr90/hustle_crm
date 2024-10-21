export const getCurrentAddress = async (latitude, longitude) => {
  return new Promise((resolve, reject) => {
    // Ensure the google.maps object is loaded
    if (!window.google || !window.google.maps) {
      reject(new Error("Google Maps API is not available"));
      return;
    }

    const geocoder = new window.google.maps.Geocoder();
    const latLng = { lat: latitude, lng: longitude };

    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === "OK" && results[0]) {
        resolve(results[0].formatted_address);
      } else {
        reject(new Error("Failed to get address from coordinates"));
      }
    });
  });
};
