import { Module } from '@nestjs/common';
import { MicroActionsService } from './micro-actions.service';
import { MicroActionsController } from './micro-actions.controller';

@Module({
  controllers: [MicroActionsController],
  providers: [MicroActionsService],
  exports: [MicroActionsService],
})
export class MicroActionsModule {}
