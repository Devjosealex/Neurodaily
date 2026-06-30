import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { FirstStepService } from './first-step.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { LocalUserId } from '../../common/decorators/user.decorator';

@Controller('first-step')
@UseGuards(AuthGuard)
export class FirstStepController {
  constructor(private readonly firstStepService: FirstStepService) {}

  @Post('generate')
  async generate(
    @LocalUserId() userId: string,
    @Body() body: { text?: string; taskId?: string },
  ) {
    return this.firstStepService.generate(userId, body);
  }
}
