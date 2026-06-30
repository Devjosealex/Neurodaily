import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService) {}

  async getNowRecommendation(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });
    const isPro = user?.subscription?.plan === 'pro';

    // Limit check for Free users (max 3 per day)
    if (!isPro) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const count = await this.prisma.recommendationLog.count({
        where: { userId, createdAt: { gte: today }, recommendedType: 'now' },
      });

      if (count >= 3) {
        throw new ForbiddenException('Has usado tus 3 recomendaciones de hoy. Vuelve mañana o mejora a Pro.');
      }
    }

    // 1. Get latest check-in for today
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const checkin = await this.prisma.dailyCheckin.findFirst({
      where: { userId, createdAt: { gte: startOfDay } },
      orderBy: { createdAt: 'desc' },
    });

    if (!checkin) {
      return { requiresCheckin: true };
    }

    // Rule Engine logic (Simplified MVP)
    const { anxietyLevel, energyLevel, currentContext, availableTime } = checkin;
    
    // R1: Ansiedad Alta + Poco Tiempo + Oficina
    if (anxietyLevel >= 4 && availableTime && availableTime <= 5 && currentContext === 'office') {
      return this.buildResponse(userId, 'breathing', 'Porque marcaste ansiedad alta, estás en la oficina y tienes poco tiempo.', checkin);
    }
    
    // R2: Ansiedad Alta
    if (anxietyLevel >= 4) {
      return this.buildResponse(userId, 'anxiety_calm', 'Para bajar tu nivel de ansiedad o estrés.', checkin);
    }

    // R3: Energía Baja + Ansiedad Baja
    if (energyLevel <= 2 && anxietyLevel <= 2) {
      return this.buildResponse(userId, 'physical_rest', 'Parece que tu energía está baja. Un pequeño descanso físico te ayudará.', checkin);
    }

    // Default: Breathing
    return this.buildResponse(userId, 'breathing', 'Una pausa de respiración siempre viene bien para centrarte.', checkin);
  }

  private async buildResponse(userId: string, category: string, reason: string, checkin: any) {
    const primaryActions = await this.prisma.microAction.findMany({
      where: { category, isActive: true },
      take: 1,
    });
    const altActions = await this.prisma.microAction.findMany({
      where: { category: 'visual_rest', isActive: true },
      take: 1,
    });

    const primary = primaryActions[0] || null;
    const alternative = altActions[0] || null;

    // Log the recommendation
    await this.prisma.recommendationLog.create({
      data: {
        userId,
        inputContext: JSON.parse(JSON.stringify(checkin)),
        recommendedType: 'now',
        recommendedId: primary?.id,
        reason,
      },
    });

    return { type: 'micro_action', primary: { ...primary, reason }, alternative, manual_option: true };
  }
}
