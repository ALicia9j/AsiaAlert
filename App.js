import React, { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, StyleSheet } from 'react-native';
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
  const [consoleLog, setConsoleLog] = useState("System initialized. Standing by for GDACS API sync.");
  const [loading, setLoading] = useState(false);
  const [activeHazard, setActiveHazard] = useState(null);

  // Gamification Handler: Processes Quiz Points & Unlocks Badges
  const handleAwardQuizPoints = (earnedPoints, isPerfectScore) => {
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
    setConsoleLog(`[GAMIFICATION] Quiz completed! Awarded +${earnedPoints} XP.`);
  };

  // Dynamic GDACS Ingestion & Geofencing Pipeline
  const syncGdacsDisasterFeed = async () => {
    setLoading(true);
    setConsoleLog("[API FETCH] Ingesting UN/EC GDACS Global Telemetry...");
    
    const gdacsEvents = await fetchGdacsAlerts();
    setLoading(false);
    
    if (!gdacsEvents || gdacsEvents.length === 0) {
      setConsoleLog("[API ERROR] Could not retrieve GDACS telemetry.");
      return;
    }
    
    setConsoleLog(`[API RESPONSE] Ingested ${gdacsEvents.length} active global GDACS events.`);
    
    let triggeredHazard = null;
    let minDistance = Infinity;

    // Iterate through GDACS events & calculate spatial proximity
    gdacsEvents.forEach(event => {
      const dist = calculateHaversineDistance(
        appState.currentLocation.latitude,
        appState.currentLocation.longitude,
        event.lat,
        event.lon
      );
      
      if (dist < minDistance) {
        minDistance = dist;
      }

      // Trigger threshold: Red or Orange alert within 1000km OR any alert within 500km
      const isHighSeverity = event.alertLevel === "Red" || event.alertLevel === "Orange";
      if ((dist < 1000 && isHighSeverity) || dist < 500) {
        if (!triggeredHazard) {
          triggeredHazard = {
            event: `${event.alertLevel.toUpperCase()} ALERT: ${event.name}`,
            magnitude: event.eventType,
            calculatedDistance: dist,
            country: event.country
          };
        }
      }
    });

    if (triggeredHazard) {
      setActiveHazard(triggeredHazard);
      setAppState(prevState => ({ ...prevState, systemMode: "ACTIVE_RESPONSE" }));
      setConsoleLog(`[CRITICAL OVERRIDE] GDACS Alert in ${triggeredHazard.country}! Proximity: ${triggeredHazard.calculatedDistance.toFixed(1)} km.`);
    } else {
      setConsoleLog(`[SAFE] Nearest active GDACS event is ${minDistance.toFixed(1)} km away. No local trigger.`);
    }
  };

  const toggleChecklistTask = (taskId) => {
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
    
    setConsoleLog(`[STATE MUTATION] Readiness Score: ${accumulatedScore}%`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
      {/* Scrollable Main Content */}
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
        
        {/* Terminal Log Output */}
        <View style={styles.logBox}>
          <Text style={styles.logText}>{consoleLog}</Text>
        </View>

        {/* View Mode Switching */}
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

      {/* Fixed Bottom Navigation Bar */}
      <View style={navStyles.navbar}>
        <TouchableOpacity
          style={navStyles.navButton}
          onPress={() => setAppState(prevState => ({ ...prevState, systemMode: "PREPARATION" }))}
        >
          <Text style={navStyles.navIcon}>📋</Text>
          <Text style={[
            navStyles.navText,
            appState.systemMode === "PREPARATION" && navStyles.activeNavText
          ]}>
            Prepare
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={navStyles.navButton}
          onPress={() => setAppState(prevState => ({ ...prevState, systemMode: "ACTIVE_RESPONSE" }))}
        >
          <Text style={navStyles.navIcon}>⚠️</Text>
          <Text style={[
            navStyles.navText,
            appState.systemMode === "ACTIVE_RESPONSE" && navStyles.activeNavText
          ]}>
            Response
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={navStyles.navButton}
          onPress={() => setAppState(prevState => ({ ...prevState, systemMode: "RECOVERY" }))}
        >
          <Text style={navStyles.navIcon}>🗺️</Text>
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

const navStyles = StyleSheet.create({
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  navText: {
    fontSize: 11,
    color: '#8E8E93',
    fontWeight: '500',
  },
  activeNavText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
