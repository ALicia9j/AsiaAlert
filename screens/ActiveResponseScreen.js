// screens/ActiveResponseScreen.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../AppStyles';

export default function ActiveResponseScreen({ activeHazard, onOpenRecovery }) {
  return (
    <View>
      <Text style={styles.headerText}>Active Emergency Response</Text>
      <View style={styles.alertBanner}>
        <Text style={styles.alertTitle}>🚨 LIVE CRISIS OVERRIDE 🚨</Text>
        <Text style={[styles.alertMeta, { marginTop: 12 }]}>
          EVENT: {activeHazard?.event || "Acute Hazard Detected"}
        </Text>
        <Text style={styles.alertMeta}>
          TYPE: {activeHazard?.magnitude || "N/A"}
        </Text>
        <Text style={styles.alertMeta}>
          PROXIMITY: {activeHazard?.calculatedDistance ? activeHazard.calculatedDistance.toFixed(1) + " km" : "< 5.0 km"}
        </Text>
        
        <TouchableOpacity style={styles.mutationAnchor} onPress={onOpenRecovery}>
          <Text style={styles.mutationAnchorText}>Open Offline Recovery Toolkit ➔</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}