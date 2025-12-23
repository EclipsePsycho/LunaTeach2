
export enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  ADMIN = 'admin'
}

export enum LearningGoal {
  CONVERSATION = 'مکالمه',
  BUSINESS = 'تجاری',
  EXAM_PREP = 'آمادگی آزمون',
  ACADEMIC = 'آکادمیک',
  TRAVEL = 'سفر',
  OTHER = 'سایر'
}

export enum EnglishLevel {
  BEGINNER = 'مبتدی',
  INTERMEDIATE = 'متوسط',
  ADVANCED = 'پیشرفته',
  NATIVE = 'بومی'
}

export enum TeachingStyle {
  STRUCTURED = 'ساختاریافته',
  CONVERSATIONAL = 'مکالمه‌محور',
  GRAMMAR_FOCUSED = 'تمرکز بر گرامر',
  IMMERSIVE = 'غوطه‌وری کامل',
  GAME_BASED = 'بازی‌محور',
  EXAM_FOCUSED = 'تمرکز بر آزمون'
}

export enum Availability {
  MORNING = 'صبح',
  AFTERNOON = 'بعدازظهر',
  EVENING = 'عصر',
  WEEKEND = 'آخر هفته'
}

export enum BookingStatus {
  PENDING = 'در انتظار',
  CONFIRMED = 'تایید شده',
  COMPLETED = 'تکمیل شده',
  CANCELLED = 'لغو شده'
}

export interface Teacher {
  id: string;
  name: string;
  photo: string;
  specialties: LearningGoal[];
  styles: TeachingStyle[];
  availability: Availability[];
  rate: number; // in Tomans
  userRating: number;
  managementRating: number;
  experienceYears: number;
  philosophy: string;
  isVerified: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

export interface StudentPreferences {
  goal: LearningGoal;
  level: EnglishLevel;
  style: TeachingStyle;
  availability: Availability[];
  budget: number;
  urgency: string;
}

export interface Session {
  id: string;
  teacherId: string;
  studentId: string;
  dateTime: string;
  status: BookingStatus;
  amount: number;
}
