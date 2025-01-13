import { Module } from '@nestjs/common';
import { ActionsRepository } from '../repositories/actions.repository';
import { ActionsService } from '../services/actions.service';

@Module({
  providers: [ActionsService, ActionsRepository],
  exports: [ActionsService],
})
export class ActionLogicModule {}
