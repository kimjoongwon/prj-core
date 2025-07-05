import { Module } from '@nestjs/common';
import { ActionsController } from '@shared/backend';

@Module({
  controllers: [ActionsController],
})
export class ActionsModule {}
