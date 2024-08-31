import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionRepository } from './session.repository';
import { TimelineModule } from '../timeline';
import { SessionController } from './session.controller';

@Module({
  imports: [TimelineModule],
  controllers: [SessionController],
  providers: [SessionService, SessionRepository],
  exports: [SessionService],
})
export class SessionModule {}
