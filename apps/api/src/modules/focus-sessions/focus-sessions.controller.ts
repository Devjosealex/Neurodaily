import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { FocusSessionsService } from './focus-sessions.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { LocalUserId } from '../../common/decorators/user.decorator';

@Controller('focus-sessions')
@UseGuards(AuthGuard)
export class FocusSessionsController {
  constructor(private readonly focusSessionsService: FocusSessionsService) {}

  @Post('start')
  async startSession(
    @LocalUserId() userId: string,
    @Body() data: { taskId?: string; microActionId?: string },
  ) {
    return this.focusSessionsService.startSession(userId, data);
  }

  @Post(':id/feedback')
  async submitFeedback(
    @LocalUserId() userId: string,
    @Param('id') id: string,
    @Body() data: { rating: number; feedback?: string; moodAfter?: number; completed: boolean },
  ) {
    return this.focusSessionsService.submitFeedback(userId, id, data);
  }
}
