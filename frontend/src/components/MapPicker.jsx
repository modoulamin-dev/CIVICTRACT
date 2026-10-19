export function MapPicker({ coords, onChange }) {
  function useDeviceLocation() {
    if (!navigator.geolocation) {
      onChange(null, "This browser cannot share a location.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange({ lat: position.coords.latitude, lng: position.coords.longitude });
      },
      () => onChange(null, "Could not read your location. You can still describe the place.")
    );
  }

  return (
    <div className="map-picker">
      <button type="button" className="btn btn-ghost" onClick={useDeviceLocation}>
        Use my current location
      </button>
      {coords ? (
        <p className="muted">
          Pin saved: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
        </p>
      ) : (
        <p className="muted">Optional. Region, town, and a landmark are enough if this does not work.</p>
      )}
    </div>
  );
}
