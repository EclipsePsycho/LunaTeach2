
import { Teacher, StudentPreferences } from '../types';

export const calculateTeacherScore = (teacher: Teacher, prefs: StudentPreferences): number => {
  let score = 0;

  // Specialties (Goal) Match
  if (teacher.specialties.includes(prefs.goal)) {
    score += 1 * 3;
  }

  // Style Match
  if (teacher.styles.includes(prefs.style)) {
    score += 1 * 2;
  }

  // Availability Match
  const matchingAvailability = teacher.availability.filter(a => prefs.availability.includes(a));
  score += matchingAvailability.length * 2;

  // Ratings
  score += teacher.userRating * 5;
  score += teacher.managementRating * 5;

  return score;
};

export const rankTeachers = (teachers: Teacher[], prefs: StudentPreferences): Teacher[] => {
  return [...teachers]
    .map(teacher => ({
      ...teacher,
      tempScore: calculateTeacherScore(teacher, prefs)
    }))
    .sort((a, b) => {
      // Primary Sort: Score
      if (b.tempScore !== a.tempScore) return b.tempScore - a.tempScore;
      
      // Secondary Sort: Budget (If score is same, show closer to budget)
      return Math.abs(a.rate - prefs.budget) - Math.abs(b.rate - prefs.budget);
    });
};
