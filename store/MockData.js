export const initialLocalState = {
  systemMode: "PREPARATION", // Modes: PREPARATION | ACTIVE_RESPONSE | RECOVERY
  userProfile: {
    readinessScore: 0,
    language: "EN",
    homeCountry: "United Kingdom",
  },
  currentLocation: {
    latitude: 35.6762,
    longitude: 139.6503,
    label: "You are here",
  },
  nearestShelter: {
    latitude: 35.6812,
    longitude: 139.6580,
    label: "Nearest Shelter",
    address: "Central Emergency Shelter #4",
  },
  emergencyContacts: {
    touristPolice: "+81 3-3581-4321",
    label: "CALL LOCAL TOURIST POLICE (OFFLINE HUB)",
  },
  offlinePhrases: [
    { id: "med", text: "I Need Urgent Medical Help", logMsg: "[ACTION] Medical Cards loaded from local cache" },
    { id: "high", text: "Where Is High Ground?", logMsg: "[ACTION] High Ground Route Filter applied to offline vector map" },
    { id: "fn", text: "I Am a Foreign National", logMsg: "[ACTION] Consular assistance contacts retrieved" },
    { id: "evac", text: "Show Evacuation Route", logMsg: "[ACTION] Vector evacuation path computed offline" },
  ],
  checklistTasks: [
    { id: "1", item: "Download Offline Map Data", weight: 25, completed: false },
    { id: "2", item: "Save Emergency Contacts locally", weight: 25, completed: false },
    { id: "3", item: "Pack 72-Hour Emergency Kit", weight: 25, completed: false },
    { id: "4", item: "Register with Embassy / Consulate", weight: 25, completed: false },
  ],
};