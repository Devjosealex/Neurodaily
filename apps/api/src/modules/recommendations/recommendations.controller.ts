import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { LocalUserId } from '../../common/decorators/user.decorator';

@Controller('recommendations')
@UseGuards(AuthGuard)
export class RecommendationsController {
  constructor(private readonly recommendationsService: RecommendationsService) {}

  @Post()
  async getRecommendation(
    @LocalUserId() userId: string,
    @Body() body: { type: 'now' | 'day-plan' },
  ) {
    if (body.type === 'now') {
      return this.recommendationsService.getNowRecommendation(userId);
    }
    // day-plan is Pro only, omitted in simplified MVP for now
    return { error: 'day-plan not implemented in free tier yet' };
  }
}
