import { Module } from '@nestjs/common';
import { SessionController } from './sessions.controller';
import { SessionModule } from '../../../shared/entities/session/session.module';

@Module({
  imports: [SessionModule],
  controllers: [SessionController],
})
export class SessionsModule {}
