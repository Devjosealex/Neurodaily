import { z } from 'zod';

// ========================
// TASK VALIDATORS
// ========================
export const CreateTaskSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().max(2000).nullable().optional(),
  category: z.string().min(1).max(50),
  cognitiveLoad: z.enum(['low', 'medium', 'high']),
  estimatedMinutes: z.number().int().positive().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

export const UpdateTaskSchema = CreateTaskSchema.partial().extend({
  status: z.enum(['pending', 'in_progress', 'completed', 'postponed']).optional(),
});

// ========================
// CHECK-IN VALIDATORS
// ========================
export const CreateCheckinSchema = z.object({
  energyLevel: z.number().int().min(1).max(5),
  anxietyLevel: z.number().int().min(1).max(5),
  currentContext: z.enum(['work', 'study', 'personal', 'home', 'commute', 'other']),
  checkinLevel: z.number().int().min(1).max(3),
  // Normal (level 2+)
  sleepQuality: z.number().int().min(1).max(5).nullable().optional(),
  availableTime: z.number().int().positive().nullable().optional(),
  canMove: z.boolean().nullable().optional(),
  // Pro (level 3)
  mentalClarity: z.number().int().min(1).max(5).nullable().optional(),
  currentState: z.string().max(50).nullable().optional(),
});

// ========================
// ONBOARDING VALIDATORS
// ========================
export const OnboardingStepSchema = z.object({
  mainGoal: z.string().max(500).optional(),
  workStyle: z.string().max(100).optional(),
  biggestChallenge: z.string().max(500).optional(),
  preferredContext: z.enum(['work', 'study', 'personal', 'home', 'commute', 'other']).optional(),
  defaultCheckinLevel: z.number().int().min(1).max(3).optional(),
  timezone: z.string().max(100).optional(),
});

// ========================
// MICRO-ACTION FEEDBACK VALIDATORS
// ========================
export const MicroActionFeedbackSchema = z.object({
  rating: z.number().int().min(1).max(5),
  feedback: z.string().max(500).nullable().optional(),
});

// ========================
// SUBSCRIPTION VALIDATORS
// ========================
export const CreateSubscriptionSchema = z.object({
  priceId: z.string().min(1),
  successUrl: z.string().url(),
  cancelUrl: z.string().url(),
});

// ========================
// FIRST STEP VALIDATORS
// ========================
export const FirstStepSchema = z.object({
  taskId: z.string().uuid().optional(),
  text: z.string().min(1).max(500).optional(),
  action: z.enum(['generate', 'easier', 'next']).default('generate'),
  currentDifficultyLevel: z.number().int().min(1).max(4).optional(),
});

// ========================
// RECOMMENDATION VALIDATORS
// ========================
export const RecommendationSchema = z.object({
  action: z.enum(['what-now', 'no-think']).default('what-now'),
  checkinId: z.string().uuid().optional(),
});

// ========================
// ADMIN VALIDATORS
// ========================
export const CreateMicroActionSchema = z.object({
  title: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  category: z.enum(['breathing', 'movement', 'cognitive', 'mindfulness', 'hydration', 'stretch', 'social']),
  goal: z.string().min(1).max(100),
  description: z.string().max(2000).nullable().optional(),
  durationSeconds: z.number().int().positive(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  energyRequired: z.enum(['low', 'medium', 'high']),
  recommendedContexts: z.array(z.string()).default([]),
  anxietyLevels: z.array(z.number().int().min(1).max(5)).default([]),
  cognitiveLoadMatch: z.enum(['low', 'medium', 'high']).nullable().optional(),
  instructions: z.array(z.string()).default([]),
  contraindications: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  isPremium: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

export const UpdateMicroActionSchema = CreateMicroActionSchema.partial();

// ========================
// EXPORTED TYPES
// ========================
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type CreateCheckinInput = z.infer<typeof CreateCheckinSchema>;
export type OnboardingInput = z.infer<typeof OnboardingStepSchema>;
export type MicroActionFeedbackInput = z.infer<typeof MicroActionFeedbackSchema>;
export type CreateSubscriptionInput = z.infer<typeof CreateSubscriptionSchema>;
export type FirstStepInput = z.infer<typeof FirstStepSchema>;
export type RecommendationInput = z.infer<typeof RecommendationSchema>;
export type CreateMicroActionInput = z.infer<typeof CreateMicroActionSchema>;
export type UpdateMicroActionInput = z.infer<typeof UpdateMicroActionSchema>;
