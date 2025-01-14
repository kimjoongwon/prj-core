import { Module } from '@nestjs/common';
import { ActionLogicModule, ActionsController } from '@shared';

@Module({
  imports: [ActionLogicModule],
  controllers: [ActionsController],
})
export class ActionsEndpointModule {}
