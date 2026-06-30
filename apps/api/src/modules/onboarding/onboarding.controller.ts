import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { LocalUserId } from '../../common/decorators/user.decorator';

@Controller('onboarding')
@UseGuards(AuthGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post('complete')
  async completeOnboarding(
    @LocalUserId() userId: string,
    @Body() preferences: any,
  ) {
    const user = await this.onboardingService.completeOnboarding(userId, preferences);
    return { success: true, preferences: user.preferences };
  }
}
