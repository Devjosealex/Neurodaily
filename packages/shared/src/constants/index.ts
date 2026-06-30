// Plan limits — single source of truth for Free/Pro restrictions
export const PLAN_LIMITS = {
  free: {
    maxActiveTasks: 5,
    maxTaskCategories: 3,
    dailyRecommendations: 3,
    dailyFirstStep: 3,
    dailyNoThink: 1,
    historyDays: 7,
    checkinLevels: [1, 2], // quick and normal only
    firstStepDifficulty: [1], // only "easier" level
  },
  pro: {
    maxActiveTasks: Infinity,
    maxTaskCategories: Infinity,
    dailyRecommendations: Infinity,
    dailyFirstStep: Infinity,
    dailyNoThink: Infinity,
    historyDays: Infinity,
    checkinLevels: [1, 2, 3],
    firstStepDifficulty: [1, 2, 3, 4],
  },
} as const;

// Usage counter types (stored in usage_counters table)
export const COUNTER_TYPES = {
  RECOMMENDATIONS: 'recommendations',
  FIRST_STEP: 'first_step',
  NO_THINK: 'no_think',
} as const;

export type CounterType = (typeof COUNTER_TYPES)[keyof typeof COUNTER_TYPES];

// Task categories
export const FREE_TASK_CATEGORIES = ['trabajo', 'estudio', 'personal'] as const;
export const PRO_TASK_CATEGORIES = [
  'trabajo',
  'estudio',
  'personal',
  'salud',
  'hobbies',
  'proyecto',
  'social',
  'finanzas',
] as const;

export type FreeTaskCategory = (typeof FREE_TASK_CATEGORIES)[number];
export type ProTaskCategory = (typeof PRO_TASK_CATEGORIES)[number];

// Cognitive load levels
export const COGNITIVE_LOAD_LEVELS = ['low', 'medium', 'high'] as const;
export type CognitiveLoad = (typeof COGNITIVE_LOAD_LEVELS)[number];

// Task status
export const TASK_STATUS = ['pending', 'in_progress', 'completed', 'postponed'] as const;
export type TaskStatus = (typeof TASK_STATUS)[number];

// Check-in levels
export const CHECKIN_LEVELS = [1, 2, 3] as const;
export type CheckinLevel = (typeof CHECKIN_LEVELS)[number];

// Check-in contexts
export const CHECKIN_CONTEXTS = [
  'work',
  'study',
  'personal',
  'home',
  'commute',
  'other',
] as const;
export type CheckinContext = (typeof CHECKIN_CONTEXTS)[number];

// User roles
export const USER_ROLES = ['user', 'admin'] as const;
export type UserRole = (typeof USER_ROLES)[number];

// Subscription plans
export const SUBSCRIPTION_PLANS = ['free', 'pro'] as const;
export type SubscriptionPlan = (typeof SUBSCRIPTION_PLANS)[number];

// Subscription status
export const SUBSCRIPTION_STATUS = ['active', 'canceled', 'past_due', 'trialing'] as const;
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[number];

// Micro-action categories
export const MICRO_ACTION_CATEGORIES = [
  'breathing',
  'movement',
  'cognitive',
  'mindfulness',
  'hydration',
  'stretch',
  'social',
] as const;
export type MicroActionCategory = (typeof MICRO_ACTION_CATEGORIES)[number];

// Vague task detection: title <= 4 words is considered vague
export const VAGUE_TASK_WORD_THRESHOLD = 4;

// Streak
export const STREAK_MAX_GAP_DAYS = 1; // 1 day gap allowed before streak resets

// Pricing
export const PRICING = {
  monthly: {
    amount: 999, // cents ($9.99)
    currency: 'usd',
  },
  yearly: {
    amount: 5999, // cents ($59.99)
    currency: 'usd',
  },
} as const;
