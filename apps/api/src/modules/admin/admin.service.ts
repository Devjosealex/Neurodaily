import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getMicroActions(query: any) {
    const where: any = {};
    if (query.category) where.category = query.category;
    if (query.active !== undefined) where.isActive = query.active === 'true';
    if (query.premium !== undefined) where.isPremium = query.premium === 'true';

    return this.prisma.microAction.findMany({
      where,
      orderBy: { title: 'asc' },
    });
  }

  async createMicroAction(data: any, adminId: string) {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    return this.prisma.microAction.create({
      data: {
        title: data.title,
        slug,
        description: data.description,
        instructions: data.instructions || '[]',
        durationSeconds: data.duration,
        category: data.category,
        goal: 'general',
        difficulty: 'medium',
        energyRequired: 'medium',
        isPremium: data.isPremium,
        isActive: data.isActive !== undefined ? data.isActive : true,
        createdByAdmin: true,
      },
    });
  }

  async updateMicroAction(id: string, data: any) {
    const action = await this.prisma.microAction.findUnique({ where: { id } });
    if (!action) throw new NotFoundException('Micro action not found');

    const updateData: any = { ...data };
    if (updateData.duration !== undefined) {
      updateData.durationSeconds = updateData.duration;
      delete updateData.duration;
    }

    return this.prisma.microAction.update({
      where: { id },
      data: updateData,
    });
  }

  async toggleMicroAction(id: string) {
    const action = await this.prisma.microAction.findUnique({ where: { id } });
    if (!action) throw new NotFoundException('Micro action not found');

    return this.prisma.microAction.update({
      where: { id },
      data: { isActive: !action.isActive },
    });
  }

  async getDashboardStats() {
    const activeMicroActions = await this.prisma.microAction.count({ where: { isActive: true } });
    const inactiveMicroActions = await this.prisma.microAction.count({ where: { isActive: false } });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentFeedbackCount = await this.prisma.userMicroActionFeedback.count({
      where: { createdAt: { gte: sevenDaysAgo } }
    });

    const microActionsStats = await this.prisma.userMicroActionFeedback.groupBy({
      by: ['microActionId'],
      _avg: { rating: true },
      _count: { id: true },
    });

    // Populate titles
    const microActions = await this.prisma.microAction.findMany({
      where: { id: { in: microActionsStats.map(s => s.microActionId) } },
      select: { id: true, title: true }
    });

    const mappedStats = microActionsStats.map(stat => ({
      microActionId: stat.microActionId,
      title: microActions.find(m => m.id === stat.microActionId)?.title || 'Unknown',
      avgRating: stat._avg.rating || 0,
      totalRatings: stat._count.id
    })).filter(s => s.totalRatings > 0);

    // Sort by rating
    mappedStats.sort((a, b) => b.avgRating - a.avgRating);

    const topRated = mappedStats.slice(0, 5);
    const bottomRated = [...mappedStats].sort((a, b) => a.avgRating - b.avgRating).slice(0, 5);

    return {
      activeMicroActions,
      inactiveMicroActions,
      recentFeedbackCount,
      topRated,
      bottomRated
    };
  }

  async getFeedback(query: any) {
    const where: any = {};
    if (query.rating_min) where.rating = { ...where.rating, gte: parseInt(query.rating_min) };
    if (query.rating_max) where.rating = { ...where.rating, lte: parseInt(query.rating_max) };
    
    if (query.category) {
      where.microAction = { category: query.category };
    }

    if (query.date_from || query.date_to) {
      where.createdAt = {};
      if (query.date_from) where.createdAt.gte = new Date(query.date_from);
      if (query.date_to) where.createdAt.lte = new Date(query.date_to);
    }

    const feedbacks = await this.prisma.userMicroActionFeedback.findMany({
      where,
      take: query.limit ? parseInt(query.limit) : 50,
      orderBy: { createdAt: 'desc' },
      include: {
        microAction: { select: { title: true, category: true } },
        user: { select: { id: true } } // Anonymous
      }
    });

    return feedbacks;
  }

  async getRecommendationLogs(query: any) {
    const where: any = {};
    if (query.type) where.recommendedType = query.type;
    if (query.accepted !== undefined) where.accepted = query.accepted === 'true';

    if (query.date_from || query.date_to) {
      where.createdAt = {};
      if (query.date_from) where.createdAt.gte = new Date(query.date_from);
      if (query.date_to) where.createdAt.lte = new Date(query.date_to);
    }

    const logs = await this.prisma.recommendationLog.findMany({
      where,
      take: query.limit ? parseInt(query.limit) : 50,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true } }
      }
    });

    const totalLogs = await this.prisma.recommendationLog.count({ where });
    const acceptedLogs = await this.prisma.recommendationLog.count({ where: { ...where, accepted: true } });
    
    return {
      logs,
      stats: {
        total: totalLogs,
        accepted: acceptedLogs,
        acceptanceRate: totalLogs > 0 ? (acceptedLogs / totalLogs) * 100 : 0
      }
    };
  }
}
