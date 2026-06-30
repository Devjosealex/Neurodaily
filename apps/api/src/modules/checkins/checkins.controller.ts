import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { CheckinsService } from './checkins.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { LocalUserId } from '../../common/decorators/user.decorator';

@Controller('checkins')
@UseGuards(AuthGuard)
export class CheckinsController {
  constructor(private readonly checkinsService: CheckinsService) {}

  @Post()
  async createCheckin(
    @LocalUserId() userId: string,
    @Body() checkinData: any,
  ) {
    return this.checkinsService.createCheckin(userId, checkinData);
  }

  @Get('today')
  async getTodayCheckin(@LocalUserId() userId: string) {
    const checkin = await this.checkinsService.getTodayCheckin(userId);
    return checkin || null;
  }
}
