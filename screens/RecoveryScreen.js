import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../AppStyles';

export default function RecoveryScreen({ recoveryData, onReset, onLog }) {
  const { currentLocation, nearestShelter, emergencyContacts, offlinePhrases } = recoveryData;

  return (
    <View style={{ flex: 1, paddingBottom: 40 }}>
      <Text style={styles.headerText}>Offline Recovery Toolkit</Text>
      
      {/* Map View Frame */}
      <View style={styles.mapContainer}>
        {/* Map Roads Simulation */}
        <View style={[styles.mapGridLineHorizontal, { top: 45 }]} />
        <View style={[styles.mapGridLineHorizontal, { top: 120 }]} />
        <View style={[styles.mapGridLineHorizontal, { top: 180 }]} />
        <View style={[styles.mapGridLineVertical, { left: 90 }]} />
        <View style={[styles.mapGridLineVertical, { left: 210 }]} />

        {/* Dynamic "You Are Here" Pin */}
        <View style={[styles.mapPin, { top: 25, left: '42%' }]}>
          <Text style={styles.mapPinText}>{currentLocation?.label || "Current Location"}</Text>
          <View style={styles.mapIconBubble}>
            <Text style={{ fontSize: 16 }}>📍</Text>
          </View>
        </View>

        {/* Dynamic "Nearest Shelter" Pin */}
        <View style={[styles.mapPin, { top: 135, left: '18%' }]}>
          <Text style={styles.mapPinText}>{nearestShelter?.label || "Shelter"}</Text>
          <View style={styles.mapIconBubble}>
            <Text style={{ fontSize: 16 }}>🏚️</Text>
          </View>
        </View>
      </View>

      {/* Dynamic Action Buttons Section */}
      <View style={{ gap: 2 }}>
        {offlinePhrases?.map((phrase) => (
          <TouchableOpacity 
            key={phrase.id} 
            style={styles.pillButton} 
            onPress={() => onLog(phrase.logMsg)}
          >
            <Text style={styles.pillButtonText}>{phrase.text}</Text>
          </TouchableOpacity>
        ))}

        {/* Dynamic Call Button */}
        <TouchableOpacity 
          style={styles.callButton} 
          onPress={() => onLog(`[DIAL] Calling ${emergencyContacts?.touristPolice || 'Emergency'}...`)}
        >
          <Text style={styles.callButtonText}>
            {emergencyContacts?.label || "CALL EMERGENCY SERVICES"}
          </Text>
        </TouchableOpacity>

        {/* Reset Button */}
        <TouchableOpacity 
          style={[styles.actionButton, { backgroundColor: '#8E8E93', marginTop: 10 }]} 
          onPress={onReset}
        >
          <Text style={styles.actionButtonText}>Reset Application Matrix</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}