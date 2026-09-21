/**
 * Haversine Formula for Geofencing Proximity Operations
 * Calculates spatial distance between two geographic coordinate pairs.
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();

  const R = 6371; // Earth's mean radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  const t1 = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const execTimeMs = (t1 - t0).toFixed(4);

  return { distance, execTimeMs };
}

function toRad(value) {
  return (value * Math.PI) / 180;
}

/**
 * Fetches live real-time global seismic disaster events from USGS
 */
export async function fetchLiveDisasterAlerts() {
  try {
    const response = await fetch('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minmagnitude=2.5');
    const data = await response.json();

    return data.features.map(feature => ({
      id: feature.id,
      event: feature.properties.title,
      lat: feature.geometry.coordinates[1],
      lon: feature.geometry.coordinates[0],
      severity: feature.properties.mag >= 5.0 ? "Critical" : "Moderate",
      magnitude: feature.properties.mag,
      place: feature.properties.place,
      time: new Date(feature.properties.time).toLocaleTimeString()
    }));
  } catch (error) {
    console.error("Failed to query live disaster API:", error);
    return [];
  }
}
