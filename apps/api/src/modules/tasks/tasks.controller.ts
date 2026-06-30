import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { LocalUserId } from '../../common/decorators/user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  async createTask(@LocalUserId() userId: string, @Body() data: any) {
    return this.tasksService.createTask(userId, data);
  }

  @Get()
  async getTasks(@LocalUserId() userId: string, @Query() query: any) {
    return this.tasksService.getTasks(userId, query);
  }

  @Get(':id')
  async getTask(@LocalUserId() userId: string, @Param('id') id: string) {
    return this.tasksService.getTask(userId, id);
  }

  @Patch('reorder')
  async reorderTasks(@LocalUserId() userId: string, @Body() data: { tasks: { id: string; orderIndex: number; dueDate?: string; startTime?: string }[] }) {
    return this.tasksService.reorderTasks(userId, data.tasks);
  }

  @Patch(':id')
  async updateTask(
    @LocalUserId() userId: string,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.tasksService.updateTask(userId, id, data);
  }

  @Delete(':id')
  async deleteTask(@LocalUserId() userId: string, @Param('id') id: string) {
    return this.tasksService.deleteTask(userId, id);
  }
}
