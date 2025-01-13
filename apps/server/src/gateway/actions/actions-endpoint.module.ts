import { Module } from '@nestjs/common';
import { ActionLogicModule } from '@shared';
import { ActionsController } from '../../shared/controllers/actions.controller';

@Module({
  imports: [ActionLogicModule],
  controllers: [ActionsController],
})
export class ActionsEndpointModule {}
