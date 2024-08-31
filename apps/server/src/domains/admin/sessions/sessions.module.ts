import { Module } from '@nestjs/common';
import { SessionModule } from '../../../shared/entities/session/session.module';
import { SessionsController } from './sessions.controller';

@Module({
  imports: [SessionModule],
  controllers: [SessionsController],
})
export class SessionsModule {}
