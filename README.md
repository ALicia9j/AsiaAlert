# AsiaAlert - Mobile Disaster Preparedness & Real-Time Hazard Response

AsiaAlert is an offline-first React Native (Expo) mobile application engineered to mitigate cognitive overload and communication breakdown during natural disasters. Designed specifically for transient travelers and local populations, the application transitions dynamically between three operational states—**Preparation Mode**, **Active Emergency Response Mode**, and **Offline Recovery Mode**—integrating live global hazard telemetry with localized offline survival tools.

---

##  Key Features & System Architecture

### 1. Dynamic Operational State Machine
The application dynamically toggles UI themes, visual cues, and functionality based on crisis state mutations:
* **Preparation Mode (Default):** Interactive gamification dashboard featuring a calculated Emergency Readiness Score (R<sub>Score</sub>), checklist tasks, interactive hazard quizzes, and badge unlocks to incentivize pre-disaster planning.
* **Active Response Mode (Crisis Override):** Triggered automatically when severe hazards are detected within proximity thresholds. It overrides standard navigation with high-contrast, low-cognitive-load emergency banners and critical proximity metrics.
* **Recovery Mode (Offline Toolkit):** Provides persistent offline tools including vector-style offline shelter map indicators, instant action logging, pre-translated emergency phrases, and direct emergency service dialing.

### 2. Live Telemetry & Geofencing Pipeline
* **UN-GDACS Integration:** Ingests live global disaster telemetry via the United Nations / European Commission Global Disaster Alert and Coordination System (GDACS) API (`https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH`).
* **Haversine Proximity Calculation:** Computes real-time spherical distance between the user's GPS coordinates and active disaster centroids using the mathematical Haversine formula to trigger critical system state mutations.

### 3. Offline-First Resilience
* **Local Data Persistence:** Maintains flat-file local JSON data schemas (`store/MockData.js`) and localized state stores to ensure full operational utility during power grid or cellular network failures.

---

##  Repository Structure

```text
fyp/
├── assets/                  # App icons, splash screens, and image assets
├── components/
│   └── QuizModal.js         # Interactive disaster readiness quiz modal
├── screens/
│   ├── PreparationScreen.js # Non-crisis gamified dashboard & checklist view
│   ├── ActiveResponseScreen.js # High-contrast emergency alert override view
│   └── RecoveryScreen.js    # Offline shelter map & survival toolkit view
├── services/
│   ├── GdacsService.js      # UN-GDACS REST API ingestion module
│   └── GeofenceService.js   # Haversine distance algorithm & USGS feeds
├── store/
│   ├── GamificationStore.js # Gamification tiers, quiz dataset, and badge rules
│   └── MockData.js          # Initial local offline data schema & state
├── .gitignore               # Standard Expo & Node git exclusion rules
├── App.js                   # Root application state machine & tab navigation
├── AppStyles.js             # Global component styles & map frame mockups
├── app.json                 # Expo project configuration manifest
├── index.js                 # Expo entry point definition
└── package.json             # Node package dependencies & run scripts
```