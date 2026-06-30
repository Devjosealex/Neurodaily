import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { OnboardingModule } from './modules/onboarding/onboarding.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { CheckinsModule } from './modules/checkins/checkins.module';
import { MicroActionsModule } from './modules/micro-actions/micro-actions.module';
import { FocusSessionsModule } from './modules/focus-sessions/focus-sessions.module';
import { RecommendationsModule } from './modules/recommendations/recommendations.module';
import { FirstStepModule } from './modules/first-step/first-step.module';
import { StripeModule } from './stripe/stripe.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { AiModule } from './modules/ai/ai.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    // Load .env globally
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../../.env',
    }),
    // Prisma database service
    PrismaModule,
    // Sprint 2 modules
    UsersModule,
    OnboardingModule,
    TasksModule,
    CheckinsModule,
    // Sprint 3 modules
    MicroActionsModule,
    FocusSessionsModule,
    RecommendationsModule,
    FirstStepModule,
    StripeModule,
    SubscriptionsModule,
    AiModule,
    AdminModule,
  ],
})
export class AppModule {}
