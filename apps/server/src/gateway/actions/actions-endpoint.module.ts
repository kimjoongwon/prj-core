import { Module } from '@nestjs/common';
import { ActionsController } from '@shared';

@Module({
  controllers: [ActionsController],
})
export class ActionsEndpointModule {}
