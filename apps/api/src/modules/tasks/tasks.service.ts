import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private isVague(title: string): boolean {
    const wordCount = title.trim().split(/\s+/).length;
    return wordCount <= 4;
  }

  async createTask(userId: string, data: any) {
    // 1. Check if user is Free or Pro
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    const isPro = user?.subscription?.plan === 'pro';

    // 2. If Free, check active tasks limit
    if (!isPro) {
      const activeTasksCount = await this.prisma.task.count({
        where: {
          userId,
          status: { not: 'completed' }, // pending, in_progress, postponed
        },
      });

      if (activeTasksCount >= 5) {
        throw new ForbiddenException(
          'Has alcanzado tus 5 tareas activas. Completa alguna o desbloquea más con Pro.',
        );
      }

      // Check category
      const freeCategories = ['work', 'study', 'personal'];
      if (!freeCategories.includes(data.category)) {
        throw new ForbiddenException(
          'Esta categoría requiere el plan Pro.',
        );
      }
    }

    // 3. Detect vagueness
    const isVague = this.isVague(data.title);

    // 4. Create task
    const task = await this.prisma.task.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        category: data.category,
        cognitiveLoad: data.cognitiveLoad,
        estimatedMinutes: data.estimatedMinutes,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        startTime: data.startTime,
        orderIndex: data.orderIndex !== undefined ? data.orderIndex : 0,
      },
    });

    return { ...task, isVague };
  }

  async getTasks(userId: string, query: any) {
    const { status, category } = query;

    const where: any = { userId };
    if (status) where.status = status;
    if (category) where.category = category;

    return this.prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async getTask(userId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) throw new NotFoundException('Tarea no encontrada');

    return { ...task, isVague: this.isVague(task.title) };
  }

  async updateTask(userId: string, taskId: string, data: any) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) throw new NotFoundException('Tarea no encontrada');

    // Free category limit check if category changed
    if (data.category) {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        include: { subscription: true },
      });

      const isPro = user?.subscription?.plan === 'pro';
      if (!isPro) {
        const freeCategories = ['work', 'study', 'personal'];
        if (!freeCategories.includes(data.category)) {
          throw new ForbiddenException('Esta categoría requiere el plan Pro.');
        }
      }
    }

    const updatedTask = await this.prisma.task.update({
      where: { id: taskId },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        cognitiveLoad: data.cognitiveLoad,
        estimatedMinutes: data.estimatedMinutes,
        dueDate: data.dueDate !== undefined ? (data.dueDate ? new Date(data.dueDate) : null) : undefined,
        startTime: data.startTime !== undefined ? data.startTime : undefined,
        orderIndex: data.orderIndex !== undefined ? data.orderIndex : undefined,
        status: data.status,
      },
    });

    return { ...updatedTask, isVague: this.isVague(updatedTask.title) };
  }

  async deleteTask(userId: string, taskId: string) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) throw new NotFoundException('Tarea no encontrada');

    await this.prisma.task.delete({
      where: { id: taskId },
    });

    return { deleted: true };
  }

  async reorderTasks(userId: string, tasks: { id: string; orderIndex: number; dueDate?: string; startTime?: string }[]) {
    // We execute reorders in a transaction
    const updatePromises = tasks.map((t) => {
      const dataToUpdate: any = { orderIndex: t.orderIndex };
      if (t.dueDate !== undefined) dataToUpdate.dueDate = t.dueDate ? new Date(t.dueDate) : null;
      if (t.startTime !== undefined) dataToUpdate.startTime = t.startTime;

      return this.prisma.task.updateMany({
        where: { id: t.id, userId },
        data: dataToUpdate,
      });
    });

    await this.prisma.$transaction(updatePromises);
    return { success: true };
  }
}
