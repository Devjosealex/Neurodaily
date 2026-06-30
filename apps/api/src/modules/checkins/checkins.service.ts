import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CheckinsService {
  constructor(private prisma: PrismaService) {}

  async createCheckin(userId: string, data: any) {
    // 1. Check if user is Free or Pro
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    const isPro = user?.subscription?.plan === 'pro';

    // 2. If Free, check if already checked in today
    if (!isPro) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const existingCheckin = await this.prisma.dailyCheckin.findFirst({
        where: {
          userId,
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      if (existingCheckin) {
        throw new ForbiddenException(
          'Tu check-in de hoy ya está registrado. Con Pro puedes actualizarlo.',
        );
      }
    }

    // 3. Ensure checkin_level 3 is only for Pro
    if (data.checkinLevel === 3 && !isPro) {
      throw new ForbiddenException('El check-in detallado requiere plan Pro.');
    }

    // 4. Create check-in
    return this.prisma.dailyCheckin.create({
      data: {
        userId,
        energyLevel: data.energyLevel,
        anxietyLevel: data.anxietyLevel,
        currentContext: data.currentContext,
        sleepQuality: data.sleepQuality,
        availableTime: data.availableTime,
        canMove: data.canMove,
        mentalClarity: data.mentalClarity,
        currentState: data.currentState,
        checkinLevel: data.checkinLevel || 1,
      },
    });
  }

  async getTodayCheckin(userId: string) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    return this.prisma.dailyCheckin.findFirst({
      where: {
        userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
