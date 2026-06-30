import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { MicroActionsService } from './micro-actions.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { LocalUserId } from '../../common/decorators/user.decorator';

@Controller('micro-actions')
@UseGuards(AuthGuard)
export class MicroActionsController {
  constructor(private readonly microActionsService: MicroActionsService) {}

  @Get()
  async findAll(
    @LocalUserId() userId: string,
    @Query('category') category?: string,
    @Query('context') context?: string,
  ) {
    return this.microActionsService.findAll(userId, category, context);
  }

  @Get(':id')
  async findOne(@LocalUserId() userId: string, @Param('id') id: string) {
    return this.microActionsService.findOne(userId, id);
  }
}
