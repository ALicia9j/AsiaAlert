// components/QuizModal.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { PREPAREDNESS_QUIZ } from '../store/GamificationStore';

export default function QuizModal({ visible, onClose, onCompleteQuiz }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentQ = PREPAREDNESS_QUIZ[currentIdx];

  const handleSelectOption = (idx) => {
    if (selectedOption !== null) return; // Prevent double taps
    setSelectedOption(idx);
    if (idx === currentQ.correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    if (currentIdx + 1 < PREPAREDNESS_QUIZ.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinished(true);
      const earnedPoints = (score + (selectedOption === currentQ.correctAnswer ? 1 : 0)) * 20;
      onCompleteQuiz(earnedPoints, score === PREPAREDNESS_QUIZ.length);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsFinished(false);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={quizStyles.overlay}>
        <View style={quizStyles.container}>
          {!isFinished ? (
            <ScrollView>
              <Text style={quizStyles.progressText}>
                Question {currentIdx + 1} of {PREPAREDNESS_QUIZ.length}
              </Text>
              <Text style={quizStyles.questionText}>{currentQ.question}</Text>

              {currentQ.options.map((opt, idx) => {
                let btnColor = '#F2F2F7';
                let textColor = '#000000';

                if (selectedOption !== null) {
                  if (idx === currentQ.correctAnswer) {
                    btnColor = '#34C759';
                    textColor = '#FFFFFF';
                  } else if (idx === selectedOption) {
                    btnColor = '#FF3B30';
                    textColor = '#FFFFFF';
                  }
                }

                return (
                  <TouchableOpacity
                    key={idx}
                    style={[quizStyles.optionButton, { backgroundColor: btnColor }]}
                    onPress={() => handleSelectOption(idx)}
                  >
                    <Text style={[quizStyles.optionText, { color: textColor }]}>{opt}</Text>
                  </TouchableOpacity>
                );
              })}

              {selectedOption !== null && (
                <View style={quizStyles.explanationBox}>
                  <Text style={quizStyles.explanationText}>{currentQ.explanation}</Text>
                  <TouchableOpacity style={quizStyles.nextButton} onPress={handleNext}>
                    <Text style={quizStyles.nextButtonText}>Next Question ➔</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          ) : (
            <View style={quizStyles.resultsBox}>
              <Text style={{ fontSize: 40, marginBottom: 10 }}>🎉</Text>
              <Text style={quizStyles.questionText}>Quiz Completed!</Text>
              <Text style={quizStyles.scoreText}>
                You scored {score} / {PREPAREDNESS_QUIZ.length}
              </Text>
              <Text style={quizStyles.rewardText}>
                +{(score * 20)} Gamification Points Earned!
              </Text>

              <TouchableOpacity style={quizStyles.nextButton} onPress={resetQuiz}>
                <Text style={quizStyles.nextButtonText}>Return to App</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const quizStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    maxHeight: '80%',
  },
  progressText: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1C1C1E',
    marginBottom: 16,
  },
  optionButton: {
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  explanationBox: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
  },
  explanationText: {
    fontSize: 13,
    color: '#3A3A3C',
    marginBottom: 10,
  },
  nextButton: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  resultsBox: {
    alignItems: 'center',
    padding: 20,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  rewardText: {
    fontSize: 16,
    color: '#34C759',
    fontWeight: 'bold',
    marginBottom: 20,
  }
});