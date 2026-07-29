import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7', paddingHorizontal: 20, paddingTop: 50 },
  headerText: { fontSize: 24, fontWeight: '700', color: '#1C1C1E', marginBottom: 20 },
  subText: { fontSize: 14, color: '#8E8E93', marginBottom: 15 },
  logBox: { backgroundColor: '#1C1C1E', padding: 14, borderRadius: 10, marginBottom: 20 },
  logText: { color: '#30D158', fontFamily: 'monospace', fontSize: 11 },
  scoreContainer: { alignItems: 'center', marginVertical: 20 },
  scoreCircle: { width: 110, height: 110, borderRadius: 55, borderWidth: 6, justifyContent: 'center', alignItems: 'center' },
  scoreNumber: { fontSize: 30, fontWeight: 'bold' },
  taskCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginVertical: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#E5E5EA' },
  taskText: { color: '#1C1C1E', fontSize: 14, flex: 1, fontWeight: '500' },
  actionButton: { backgroundColor: '#007AFF', paddingVertical: 16, borderRadius: 30, alignItems: 'center', marginVertical: 12 },
  actionButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  alertBanner: { backgroundColor: '#FF3B30', padding: 24, borderRadius: 16, alignItems: 'center', marginTop: 15 },
  alertTitle: { fontSize: 20, fontWeight: '900', color: '#FFFFFF', textAlign: 'center' },
  alertMeta: { fontSize: 15, color: '#FFFFFF', marginVertical: 4, fontWeight: '600' },
  mutationAnchor: { backgroundColor: '#FFFFFF', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 25, marginTop: 20, width: '100%', alignItems: 'center' },
  mutationAnchorText: { color: '#FF3B30', fontWeight: 'bold', fontSize: 15 },
  
  // Custom Map Mockup Styles with generous height & margins
  mapContainer: { 
    width: '100%', 
    height: 250, 
    backgroundColor: '#EBF3F5', 
    borderRadius: 18, 
    overflow: 'hidden', 
    position: 'relative', 
    marginBottom: 24, 
    borderWidth: 1, 
    borderColor: '#D1D1D6' 
  },
  mapGridLineVertical: { position: 'absolute', width: 25, height: '100%', backgroundColor: '#B2D8D8', opacity: 0.5, transform: [{ rotate: '20deg' }] },
  mapGridLineHorizontal: { position: 'absolute', width: '100%', height: 12, backgroundColor: '#D4E6F1', opacity: 0.8 },
  mapPin: { position: 'absolute', alignItems: 'center' },
  mapPinText: { fontSize: 12, fontWeight: '600', color: '#1C1C1E', marginBottom: 4, backgroundColor: '#FFFFFF', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, overflow: 'hidden' },
  mapIconBubble: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#1C1C1E' },

  // Spaced-out Pill Buttons
  pillButton: { 
    backgroundColor: '#E5E5EA', 
    borderRadius: 30, 
    paddingVertical: 18, 
    paddingHorizontal: 24, 
    marginVertical: 7, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  pillButtonText: { fontSize: 16, color: '#000000', fontWeight: '500' },
  callButton: { 
    backgroundColor: '#34C759', 
    borderRadius: 30, 
    paddingVertical: 18, 
    paddingHorizontal: 24, 
    marginTop: 18, 
    marginBottom: 20, 
    alignItems: 'center',
    justifyContent: 'center'
  },
  callButtonText: { fontSize: 14, color: '#FFFFFF', fontWeight: 'bold', letterSpacing: 0.5 }
});