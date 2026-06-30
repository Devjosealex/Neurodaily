import { Module } from '@nestjs/common';
import { FirstStepService } from './first-step.service';
import { FirstStepController } from './first-step.controller';

@Module({
  controllers: [FirstStepController],
  providers: [FirstStepService],
  exports: [FirstStepService],
})
export class FirstStepModule {}
