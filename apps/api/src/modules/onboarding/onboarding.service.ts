import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  async completeOnboarding(userId: string, preferences: any) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        preferences,
        onboardingCompleted: true,
      },
    });
  }
}
