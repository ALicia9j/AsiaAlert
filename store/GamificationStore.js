// store/GamificationStore.js
export const BADGES = [
  {
    id: 'first_step',
    title: 'Pioneer Sentinel',
    icon: '🛡️',
    description: 'Completed your first preparedness checklist item.',
    unlockedAtScore: 10,
  },
  {
    id: 'kit_master',
    title: 'Survival Strategist',
    icon: '🎒',
    description: 'Achieved a 50% Emergency Readiness score.',
    unlockedAtScore: 50,
  },
  {
    id: 'disaster_ready',
    title: 'Resilience Master',
    icon: '🏆',
    description: 'Achieved an 80%+ Emergency Readiness score.',
    unlockedAtScore: 80,
  },
  {
    id: 'quiz_hero',
    title: 'Emergency Scholar',
    icon: '🎓',
    description: 'Scored 100% on the Disaster Readiness Quiz.',
    unlockedAtScore: 0,
  }
];

export const PREPAREDNESS_QUIZ = [
  {
    id: 1,
    question: "What is the primary rule during a high-magnitude Earthquake?",
    options: ["Run outside immediately", "Drop, Cover, and Hold On", "Stand near a glass window", "Use the elevator"],
    correctAnswer: 1,
    explanation: "Standard global protocol dictates dropping to hands and knees, taking cover under sturdy furniture, and holding on until shaking stops."
  },
  {
    id: 2,
    question: "How much clean water should be stored per person per day in an emergency kit?",
    options: ["1 Liter", "3 Liters (Approx. 1 Gallon)", "500 ml", "10 Liters"],
    correctAnswer: 1,
    explanation: "Humanitarian standards (e.g., Red Cross) recommend at least 1 gallon (~3-4 liters) per person per day for drinking and sanitation."
  },
  {
    id: 3,
    question: "If a Tsunami warning is issued, where should you head immediately?",
    options: ["To the coastline to observe waves", "Inland to high ground or upper floors of a concrete building", "Into a basement", "Under a wooden table"],
    correctAnswer: 1,
    explanation: "Tsunami risk requires rapid movement inland and to higher elevation away from low-lying coastal zones."
  }
];

export function calculateUserLevel(totalPoints) {
  if (totalPoints >= 150) return { level: 3, title: 'Disaster Commander', color: '#34C759' };
  if (totalPoints >= 75) return { level: 2, title: 'Prepared Resident', color: '#007AFF' };
  return { level: 1, title: 'Novice Recruit', color: '#FF9500' };
}