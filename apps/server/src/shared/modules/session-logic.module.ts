import { Module } from '@nestjs/common';
import { SessionRepository } from '../repositories';
import { SessionService } from '../services/session.service';

@Module({
  providers: [SessionService, SessionRepository],
  exports: [SessionService],
})
export class SessionLogicModule {}
