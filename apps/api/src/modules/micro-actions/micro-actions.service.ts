import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MicroActionsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string, category?: string, context?: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    const isPro = user?.subscription?.plan === 'pro';

    const where: any = { isActive: true };
    if (category) where.category = category;
    
    // Si no es Pro, solo puede ver breathing y 2 random (MVP simplificado: si es Free y no es breathing, y es premium -> bloqueado)
    // Para simplificar, la BD tiene isPremium
    if (!isPro) {
       // Free users can only see non-premium actions
       where.isPremium = false;
    }

    // Context filter is JSONB in Prisma. Simplest is to fetch and filter in memory for MVP, or use Prisma JSON filters.
    // For MVP, we fetch all matching category/premium and filter context in memory if provided.
    const actions = await this.prisma.microAction.findMany({ where, orderBy: { sortOrder: 'asc' } });

    if (context) {
      return actions.filter((a: any) => {
        const contexts = a.recommendedContexts as string[];
        return contexts.includes(context);
      });
    }

    return actions;
  }

  async findOne(userId: string, id: string) {
    const action = await this.prisma.microAction.findUnique({
      where: { id },
    });

    if (!action) throw new NotFoundException('Microacción no encontrada');

    if (action.isPremium) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: true },
      });
      const isPro = user?.subscription?.plan === 'pro';
      
      if (!isPro) {
        throw new ForbiddenException('Esta microacción es exclusiva para el plan Pro. 🌿');
      }
    }

    return action;
  }
}
