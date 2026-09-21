import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { initialLocalState } from './store/MockData';
import { calculateHaversineDistance } from './services/GeofenceService';
import { fetchGdacsAlerts } from './services/GdacsService';
import { styles } from './AppStyles';

// Screen Component Imports
import PreparationScreen from './screens/PreparationScreen';
import ActiveResponseScreen from './screens/ActiveResponseScreen';
import RecoveryScreen from './screens/RecoveryScreen';

export default function App() {
  const [appState, setAppState] = useState(initialLocalState);
  const [consoleLog, setConsoleLog] = useState("System initialized. Standing by for UN-GDACS API sync.");
  const [loading, setLoading] = useState(false);
  const [activeHazard, setActiveHazard] = useState(null);

  // Gamification Handler: Processes Quiz Points & Unlocks Badges
  const handleAwardQuizPoints = (earnedPoints, isPerfectScore) => {
    const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
    setAppState(prevState => {
      const newScore = prevState.userProfile.readinessScore + earnedPoints;
      const existingBadges = [...(prevState.userProfile.unlockedBadges || [])];

      if (isPerfectScore && !existingBadges.includes('quiz_hero')) {
        existingBadges.push('quiz_hero');
      }
      return {
        ...prevState,
        userProfile: {
          ...prevState.userProfile,
          readinessScore: newScore,
          unlockedBadges: existingBadges
        }
      };
    });
    const t1 = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const mutationTime = (t1 - t0).toFixed(2);
    setConsoleLog(`[GAMIFICATION] Quiz completed! Awarded +${earnedPoints} XP. (State mutation: ${mutationTime} ms)`);
  };

  // Dynamic GDACS Ingestion & Geofencing Pipeline
  const syncGdacsDisasterFeed = async () => {
    setLoading(true);
    setConsoleLog("[API FETCH] Ingesting UN/EC GDACS Global Telemetry...");
    
    const gdacsEvents = await fetchGdacsAlerts();
    setLoading(false);
    
    if (!gdacsEvents || gdacsEvents.length === 0) {
      setConsoleLog("[API ERROR] Offline mode active. Could not fetch GDACS remote telemetry.");
      return;
    }

    const startCompute = typeof performance !== 'undefined' ? performance.now() : Date.now();
    let triggeredHazard = null;
    let minDistance = Infinity;

    // Iterate through GDACS events & calculate spatial proximity
    gdacsEvents.forEach(event => {
      const { distance } = calculateHaversineDistance(
        appState.currentLocation.latitude,
        appState.currentLocation.longitude,
        event.lat,
        event.lon
      );

      if (distance < minDistance) {
        minDistance = distance;
      }

      const isHighSeverity = event.alertLevel === "Red" || event.alertLevel === "Orange";
      if ((distance < 1000 && isHighSeverity) || distance < 500) {
        if (!triggeredHazard) {
          triggeredHazard = {
            event: `${event.alertLevel.toUpperCase()} ALERT: ${event.name}`,
            magnitude: event.eventType,
            calculatedDistance: distance,
            country: event.country
          };
        }
      }
    });

    const endCompute = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const totalComputeMs = (endCompute - startCompute).toFixed(2);

    if (triggeredHazard) {
      setActiveHazard(triggeredHazard);
      setAppState(prevState => ({ ...prevState, systemMode: "ACTIVE_RESPONSE" }));
      setConsoleLog(`[CRITICAL OVERRIDE] Hazard in ${triggeredHazard.country}! Distance: ${triggeredHazard.calculatedDistance.toFixed(1)} km (Batch Haversine Loop: ${totalComputeMs} ms).`);
    } else {
      setConsoleLog(`[SAFE] Nearest active event is ${minDistance.toFixed(1)} km away. (Processed in ${totalComputeMs} ms).`);
    }
  };

  const toggleChecklistTask = (taskId) => {
    const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const updatedTasks = appState.checklistTasks.map(task => {
      if (task.id === taskId) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });

    let accumulatedScore = 0;
    updatedTasks.forEach(task => {
      if (task.completed) accumulatedScore += task.weight;
    });

    setAppState(prevState => ({
      ...prevState,
      checklistTasks: updatedTasks,
      userProfile: {
        ...prevState.userProfile,
        readinessScore: accumulatedScore
      }
    }));

    const t1 = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const mutationTime = (t1 - t0).toFixed(2);
    setConsoleLog(`[STATE MUTATION] Readiness Score: ${accumulatedScore}% (Mutation time: ${mutationTime} ms)`);
  };

  // Instant Simulated Crisis Override for Video Recording
  const triggerSimulatedCrisis = () => {
    const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
    
    setActiveHazard({
      event: "RED ALERT: Simulated Major Seismic Event",
      magnitude: "EQ (Magnitude 7.2)",
      calculatedDistance: 4.8,
      country: "Japan"
    });
    
    setAppState(prevState => ({ ...prevState, systemMode: "ACTIVE_RESPONSE" }));
    
    const t1 = typeof performance !== 'undefined' ? performance.now() : Date.now();
    const latency = (t1 - t0).toFixed(2);
    setConsoleLog(`[CRITICAL OVERRIDE] State Mutation to ACTIVE_RESPONSE completed in ${latency} ms.`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 40 }} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Real-time Telemetry Console */}
        <View style={styles.logBox}>
          <Text style={styles.logText}>{consoleLog}</Text>
        </View>

        {/* View Mode Router */}
        {appState.systemMode === "PREPARATION" && (
          <PreparationScreen
            userProfile={appState.userProfile}
            checklistTasks={appState.checklistTasks}
            onToggleTask={toggleChecklistTask}
            onSyncFeed={syncGdacsDisasterFeed}
            loading={loading}
            onAwardQuizPoints={handleAwardQuizPoints}
          />
        )}

        {appState.systemMode === "ACTIVE_RESPONSE" && (
          <ActiveResponseScreen
            activeHazard={activeHazard}
            onOpenRecovery={() => setAppState(prevState => ({ ...prevState, systemMode: "RECOVERY" }))}
          />
        )}

        {appState.systemMode === "RECOVERY" && (
          <RecoveryScreen
            recoveryData={{
              currentLocation: appState.currentLocation,
              nearestShelter: appState.nearestShelter,
              emergencyContacts: appState.emergencyContacts,
              offlinePhrases: appState.offlinePhrases
            }}
            onReset={() => {
              setAppState(initialLocalState);
              setActiveHazard(null);
              setConsoleLog("System state reset to Preparation.");
            }}
            onLog={(msg) => setConsoleLog(msg)}
          />
        )}
      </ScrollView>

      {/* Fixed Navigation Bar */}
      <View style={navStyles.navbar}>
        <TouchableOpacity
          style={navStyles.navButton}
          onPress={() => setAppState(prevState => ({ ...prevState, systemMode: "PREPARATION" }))}
        >
          <Text style={[
            navStyles.navText,
            appState.systemMode === "PREPARATION" && navStyles.activeNavText
          ]}>
            Prepare
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={navStyles.navButton}
          onPress={triggerSimulatedCrisis}
        >
          <Text style={[
            navStyles.navText,
            appState.systemMode === "ACTIVE_RESPONSE" && navStyles.activeNavText
          ]}>
            Response (Demo)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={navStyles.navButton}
          onPress={() => setAppState(prevState => ({ ...prevState, systemMode: "RECOVERY" }))}
        >
          <Text style={[
            navStyles.navText,
            appState.systemMode === "RECOVERY" && navStyles.activeNavText
          ]}>
            Recovery
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const navStyles = {
  navbar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
    paddingBottom: 10,
    elevation: 8,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navText: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  activeNavText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
};
