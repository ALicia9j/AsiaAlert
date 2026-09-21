import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BADGES, calculateUserLevel } from '../store/GamificationStore';
import QuizModal from '../components/QuizModal';

export default function PreparationScreen({
  userProfile,
  checklistTasks,
  onToggleTask,
  onSyncFeed,
  loading,
  onAwardQuizPoints
}) {
  const [quizVisible, setQuizVisible] = useState(false);
  const userLevel = calculateUserLevel(userProfile.readinessScore);

  return (
    <View style={prepStyles.container}>
      {/* Gamification Header Banner */}
      <View style={prepStyles.rankCard}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={prepStyles.rankSub}>CURRENT RESILIENCE TIER</Text>
            <Text style={[prepStyles.rankTitle, { color: userLevel.color }]}>{userLevel.title}</Text>
          </View>
          <Text style={prepStyles.levelBadge}>LVL {userLevel.level}</Text>
        </View>

        {/* Readiness Metric Bar */}
        <View style={{ marginTop: 15 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
            <Text style={prepStyles.metricText}>Readiness Score</Text>
            <Text style={prepStyles.metricScore}>{userProfile.readinessScore} XP</Text>
          </View>
          <View style={prepStyles.progressBarTrack}>
            <View 
              style={[
                prepStyles.progressBarFill, 
                { width: `${Math.min(userProfile.readinessScore, 100)}%`, backgroundColor: userLevel.color }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Badges Shelf */}
      <Text style={prepStyles.sectionHeader}>Unlocked Badges</Text>
      <View style={prepStyles.badgeRow}>
        {BADGES.map(badge => {
          const isUnlocked = (userProfile.unlockedBadges || []).includes(badge.id) || 
                                userProfile.readinessScore >= badge.unlockedAtScore;
          return (
            <View key={badge.id} style={[prepStyles.badgeCard, !isUnlocked && prepStyles.badgeLocked]}>
              <Text style={{ fontSize: 22 }}>{isUnlocked ? badge.icon : "🔒"}</Text>
              <Text style={prepStyles.badgeTitle}>{badge.title}</Text>
            </View>
          );
        })}
      </View>

      {/* Gamified Quiz Trigger */}
      <TouchableOpacity 
        style={prepStyles.quizBanner}
        onPress={() => setQuizVisible(true)}
      >
        <Text style={{ fontSize: 22, marginRight: 12 }}>🧠</Text>
        <View style={{ flex: 1 }}>
          <Text style={prepStyles.quizBannerTitle}>Test Your Disaster Knowledge</Text>
          <Text style={prepStyles.quizBannerSub}>Earn +60 XP & Unlock Scholar Badge</Text>
        </View>
        <Text style={{ fontSize: 18, color: '#007AFF' }}>➔</Text>
      </TouchableOpacity>

      {/* Sync GDACS Button */}
      <TouchableOpacity 
        style={[prepStyles.actionButton, { backgroundColor: '#34C759', marginVertical: 12 }]}
        onPress={onSyncFeed}
        disabled={loading}
      >
        <Text style={prepStyles.actionButtonText}>
          {loading ? "Syncing Feed..." : "🌐 Sync UN-GDACS Global Hazard Feed"}
        </Text>
      </TouchableOpacity>

      {/* Readiness Checklist */}
      <Text style={prepStyles.sectionHeader}>Preparation Tasks</Text>
      {checklistTasks.map(task => (
        <TouchableOpacity 
          key={task.id}
          style={prepStyles.taskItem}
          onPress={() => onToggleTask(task.id)}
        >
          <Text style={{ fontSize: 18 }}>{task.completed ? "✅" : "⬜"}</Text>
          <Text style={[prepStyles.taskText, task.completed && prepStyles.completedTaskText]}>
            {task.item} (+{task.weight} XP)
          </Text>
        </TouchableOpacity>
      ))}

      {/* Interactive Quiz Modal */}
      <QuizModal 
        visible={quizVisible}
        onClose={() => setQuizVisible(false)}
        onCompleteQuiz={onAwardQuizPoints}
      />
    </View>
  );
}

const prepStyles = StyleSheet.create({
  container: { paddingBottom: 10 },
  rankCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  rankSub: { fontSize: 10, color: '#8E8E93', fontWeight: 'bold' },
  rankTitle: { fontSize: 22, fontWeight: 'bold' },
  levelBadge: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontWeight: 'bold',
    fontSize: 12,
  },
  metricText: { fontSize: 12, color: '#3A3A3C', fontWeight: '500' },
  metricScore: { fontSize: 12, fontWeight: 'bold' },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%' },
  sectionHeader: { fontSize: 16, fontWeight: 'bold', marginVertical: 10, color: '#1C1C1E' },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  badgeCard: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '23%',
    elevation: 1,
  },
  badgeLocked: { opacity: 0.35 },
  badgeTitle: { fontSize: 9, textAlign: 'center', marginTop: 4, fontWeight: '600' },
  quizBanner: {
    backgroundColor: '#E3F2FD',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#90CAF9',
  },
  quizBannerTitle: { fontSize: 14, fontWeight: 'bold', color: '#0D47A1' },
  quizBannerSub: { fontSize: 11, color: '#1565C0' },
  actionButton: { padding: 14, borderRadius: 10, alignItems: 'center' },
  actionButtonText: { color: '#FFFFFF', fontWeight: 'bold' },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  taskText: { marginLeft: 10, fontSize: 14, color: '#1C1C1E' },
  completedTaskText: { textDecorationLine: 'line-through', color: '#8E8E93' },
});
