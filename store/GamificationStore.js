export const BADGES = [
  {
    id: 'first_step',
    title: 'Ready Starter',
    icon: '🌱',
    unlockedAtScore: 10,
    description: 'Completed your first preparedness action.'
  },
  {
    id: 'halfway',
    title: 'Resilience Builder',
    icon: '🛡️',
    unlockedAtScore: 50,
    description: 'Reached 50% preparedness readiness.'
  },
  {
    id: 'fully_prepared',
    title: 'Disaster Master',
    icon: '🏆',
    unlockedAtScore: 100,
    description: 'Completed all preparation tasks.'
  },
  {
    id: 'quiz_hero',
    title: 'Knowledge Scholar',
    icon: '🧠',
    unlockedAtScore: 0, // Unlocked dynamically via quiz completion
    description: 'Scored 100% on the Disaster Readiness Quiz.'
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
export function calculateUserLevel(score) {
  if (score >= 120) {
    return { level: 4, title: 'Guardian Elite', color: '#FF9500' };
  } else if (score >= 80) {
    return { level: 3, title: 'Resilience Vanguard', color: '#34C759' };
  } else if (score >= 40) {
    return { level: 2, title: 'Prepared Defender', color: '#007AFF' };
  } else {
    return { level: 1, title: 'Novice Responder', color: '#8E8E93' };
  }
}
