import type {
  CognitiveLoad,
  TaskStatus,
  CheckinLevel,
  CheckinContext,
  UserRole,
  SubscriptionPlan,
  SubscriptionStatus,
  MicroActionCategory,
} from '../constants';

// ========================
// USER
// ========================
export interface UserPreferences {
  defaultCheckinLevel?: CheckinLevel;
  preferredContext?: CheckinContext;
  workStartHour?: number;
  workEndHour?: number;
  focusDurationMinutes?: number;
  notifications?: {
    checkinReminder?: boolean;
    streakReminder?: boolean;
  };
}

export interface User {
  id: string;
  clerkUserId: string;
  email: string;
  name: string | null;
  role: UserRole;
  timezone: string;
  preferences: UserPreferences;
  streakCount: number;
  streakLastDate: string | null; // ISO date string
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserPublic = Pick<User, 'id' | 'name' | 'email' | 'role' | 'onboardingCompleted' | 'streakCount' | 'streakLastDate' | 'preferences'>;

// ========================
// SUBSCRIPTION
// ========================
export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserPlan = SubscriptionPlan;

// ========================
// TASK
// ========================
export interface Task {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  category: string;
  cognitiveLoad: CognitiveLoad;
  estimatedMinutes: number | null;
  dueDate: string | null;
  status: TaskStatus;
  isVague?: boolean; // computed, not stored
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskDto = Pick<Task, 'title' | 'description' | 'category' | 'cognitiveLoad' | 'estimatedMinutes' | 'dueDate'>;
export type UpdateTaskDto = Partial<CreateTaskDto & Pick<Task, 'status'>>;

// ========================
// CHECK-IN
// ========================
export interface DailyCheckin {
  id: string;
  userId: string;
  energyLevel: number;    // 1-5
  anxietyLevel: number;   // 1-5
  currentContext: CheckinContext;
  sleepQuality: number | null;     // 1-5 (normal+)
  availableTime: number | null;    // minutes (normal+)
  canMove: boolean | null;         // (normal+)
  mentalClarity: number | null;    // 1-5 (pro only)
  currentState: string | null;     // pro only
  checkinLevel: CheckinLevel;
  createdAt: string;
}

export type CreateCheckinDto = Omit<DailyCheckin, 'id' | 'userId' | 'createdAt'>;

// ========================
// MICRO-ACTION
// ========================
export interface MicroAction {
  id: string;
  title: string;
  slug: string;
  category: MicroActionCategory;
  goal: string;
  description: string | null;
  durationSeconds: number;
  difficulty: 'easy' | 'medium' | 'hard';
  energyRequired: 'low' | 'medium' | 'high';
  recommendedContexts: CheckinContext[];
  anxietyLevels: number[];
  cognitiveLoadMatch: CognitiveLoad | null;
  instructions: string[];
  contraindications: string[];
  isActive: boolean;
  isPremium: boolean;
  createdByAdmin: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface MicroActionFeedback {
  id: string;
  userId: string;
  microActionId: string;
  rating: number; // 1-5
  feedback: string | null;
  createdAt: string;
}

// ========================
// RECOMMENDATION
// ========================
export interface RecommendationResult {
  type: 'task' | 'micro_action' | 'no_think';
  task?: Task;
  microAction?: MicroAction;
  reason: string;
  priority: number;
}

export interface RecommendationLog {
  id: string;
  userId: string;
  inputContext: Record<string, unknown>;
  recommendedType: string;
  recommendedId: string | null;
  reason: string;
  accepted: boolean | null;
  createdAt: string;
}

// ========================
// FIRST STEP
// ========================
export interface FirstStepResult {
  step: string;
  difficultyLevel: 1 | 2 | 3 | 4;
  generationMethod: 'rules' | 'ai';
}

export interface FirstStepLog {
  id: string;
  userId: string;
  taskId: string | null;
  originalText: string;
  generatedStep: string;
  difficultyLevel: 1 | 2 | 3 | 4;
  generationMethod: 'rules' | 'ai';
  accepted: boolean | null;
  createdAt: string;
}

// ========================
// USAGE COUNTER
// ========================
export interface UsageCounter {
  id: string;
  userId: string;
  counterType: string;
  counterDate: string; // ISO date
  count: number;
}

// ========================
// API RESPONSES
// ========================
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ========================
// ONBOARDING
// ========================
export interface OnboardingStep {
  step: 1 | 2 | 3 | 4 | 5 | 6;
  completed: boolean;
}

export type OnboardingData = {
  mainGoal?: string;
  workStyle?: string;
  biggestChallenge?: string;
  preferredContext?: CheckinContext;
  defaultCheckinLevel?: CheckinLevel;
  timezone?: string;
};
