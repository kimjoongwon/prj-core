import { Module } from '@nestjs/common';
import { SessionLogicModule, SessionsController } from '@shared';

@Module({
  imports: [SessionLogicModule],
  controllers: [SessionsController],
})
export class SessionsEndpointModule {}
