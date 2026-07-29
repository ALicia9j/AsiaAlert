// services/GeofenceService.js
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const radLat1 = lat1 * (Math.PI / 180);
  const radLat2 = lat2 * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
          
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
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