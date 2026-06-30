import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { LocalUserId } from '../common/decorators/user.decorator';

@Controller('subscriptions')
@UseGuards(AuthGuard)
export class SubscriptionsController {
  constructor(private readonly subscriptionsService: SubscriptionsService) {}

  @Get('current')
  getCurrentSubscription(@LocalUserId() userId: string) {
    return this.subscriptionsService.getCurrentSubscription(userId);
  }

  @Post('checkout')
  createCheckoutSession(@LocalUserId() userId: string) {
    return this.subscriptionsService.createCheckoutSession(userId);
  }

  @Post('portal')
  createPortalSession(@LocalUserId() userId: string) {
    return this.subscriptionsService.createPortalSession(userId);
  }
}
