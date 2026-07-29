// services/GdacsService.js
const GDACS_EVENT_LIST_URL = "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH?";

/**
 * Fetches real-time disaster alerts from UN/EC GDACS feed
 */
export async function fetchGdacsAlerts() {
  try {
    const response = await fetch(GDACS_EVENT_LIST_URL);
    if (!response.ok) {
      throw new Error(`GDACS API HTTP status: ${response.status}`);
    }
    const data = await response.json();
              
    if (data && data.features) {
      return data.features.map(feature => ({
        id: feature.properties.eventid,
        eventType: feature.properties.eventtype,
        name: feature.properties.name || feature.properties.eventname,
        country: feature.properties.country,
        alertLevel: feature.properties.alertlevel,
        description: feature.properties.description,
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
        fromDate: feature.properties.fromdate
      }));
    }
    return [];
  } catch (error) {
    console.error("[GDACS API Error]:", error);
    return [];
  }
}