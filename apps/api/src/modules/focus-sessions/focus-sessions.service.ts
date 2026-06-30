import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FocusSessionsService {
  constructor(private prisma: PrismaService) {}

  async startSession(userId: string, data: { taskId?: string; microActionId?: string }) {
    if (!data.taskId && !data.microActionId) {
      throw new Error('Debe proveer taskId o microActionId');
    }

    if (data.taskId) {
      const task = await this.prisma.task.findFirst({ where: { id: data.taskId, userId } });
      if (!task) throw new NotFoundException('Tarea no encontrada');
      
      // Auto update task to in_progress
      if (task.status === 'pending') {
        await this.prisma.task.update({ where: { id: task.id }, data: { status: 'in_progress' }});
      }
    }

    if (data.microActionId) {
      const ma = await this.prisma.microAction.findUnique({ where: { id: data.microActionId } });
      if (!ma) throw new NotFoundException('Microacción no encontrada');
    }

    return this.prisma.focusSession.create({
      data: {
        userId,
        taskId: data.taskId,
        microActionId: data.microActionId,
        startedAt: new Date(),
      },
    });
  }

  async submitFeedback(userId: string, sessionId: string, data: { rating: number; feedback?: string; moodAfter?: number; completed: boolean }) {
    const session = await this.prisma.focusSession.findFirst({
      where: { id: sessionId, userId },
    });

    if (!session) throw new NotFoundException('Sesión no encontrada');

    const updatedSession = await this.prisma.focusSession.update({
      where: { id: sessionId },
      data: {
        endedAt: new Date(),
        completed: data.completed,
        moodAfter: data.moodAfter,
      },
    });

    // Si es una microacción, guarda el feedback
    if (session.microActionId) {
      await this.prisma.userMicroActionFeedback.create({
        data: {
          userId,
          microActionId: session.microActionId,
          rating: data.rating,
          feedback: data.feedback,
        },
      });
    }

    // Si estaba ligada a una tarea y se completó exitosamente (opcional logic, maybe just keep in_progress)
    return updatedSession;
  }
}
