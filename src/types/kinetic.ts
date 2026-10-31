export type WorkoutCategory = 'strength' | 'aerobic' | 'interval' | 'mobility' | 'olympic';

export interface ExerciseSet {
  id: string;
  setNumber: number;
  prevBest?: string;
  targetWeight: number;
  targetReps: number;
  actualWeight?: number;
  actualReps?: number;
  rpe?: number; // 1 - 10
  completed: boolean;
  restSec: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: WorkoutCategory;
  movementPattern: 'Squat' | 'Hinge' | 'Push' | 'Pull' | 'Lunge' | 'Carry' | 'Conditioning' | 'Prehab';
  equipment: 'Barbell' | 'Dumbbell' | 'Kettlebell' | 'Ergometer' | 'Bodyweight' | 'Cable';
  primaryMuscle: string;
  secondaryMuscles: string[];
  coachingCue: string;
  tempo: string; // e.g. "3-1-X-0"
  pr1RM?: string;
  sets: ExerciseSet[];
  imagePath?: string;
}

export interface WorkoutSession {
  id: string;
  title: string;
  category: WorkoutCategory;
  phase: string;
  scheduledTime: string;
  durationMin: number;
  caloriesBurned?: number;
  targetVolumeKg?: number;
  actualVolumeKg?: number;
  status: 'completed' | 'in-progress' | 'upcoming';
  avgHeartRate?: number;
  maxHeartRate?: number;
  rpeTarget: number;
  actualRpe?: number;
  notes?: string;
  exercises: Exercise[];
  imagePath?: string;
}

export interface AthleticHabit {
  id: string;
  title: string;
  target: string;
  current: string;
  completed: boolean;
  category: 'hydration' | 'nutrition' | 'mobility' | 'recovery' | 'sleep';
}

export interface DayRegimen {
  date: string; // YYYY-MM-DD
  dayAbbr: string; // Mon, Tue, etc.
  dayNumber: number;
  isToday: boolean;
  strainTarget: number;
  actualStrain: number;
  readinessScore: number; // 0 - 100
  hrvMs: number;
  restingHr: number;
  sleepHours: number;
  recoveryStatus: 'peak' | 'optimal' | 'moderate' | 'depleted';
  sessions: WorkoutSession[];
  disciplines: AthleticHabit[];
}

export interface TrainingProtocol {
  id: string;
  title: string;
  subtitle: string;
  durationWeeks: number;
  currentWeek: number;
  daysPerWeek: number;
  level: 'Intermediate' | 'Advanced' | 'Elite';
  focus: string;
  description: string;
  intensityScore: number; // 1-10
  isActive: boolean;
  completionRate: number; // percentage
  weeklySchedule: {
    day: string;
    focus: string;
    duration: string;
    intensity: 'Low' | 'Moderate' | 'High' | 'Maximal';
  }[];
}

export interface PersonalRecord {
  id: string;
  exerciseName: string;
  category: 'Strength 1RM' | 'Pacing & Cadence' | 'Volume' | 'Endurance';
  value: number;
  unit: string;
  dateAchieved: string;
  improvement: string;
}

export interface AthleteProfile {
  name: string;
  handle: string;
  age: number;
  weightKg: number;
  heightCm: number;
  restingHr: number;
  maxHr: number;
  vo2Max: number;
  trainingAgeYears: number;
  unitPreference: 'metric' | 'imperial';
  darkMode: boolean;
  soundAlerts: boolean;
  defaultRestSec: number;
}
