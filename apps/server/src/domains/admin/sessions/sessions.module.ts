import { Module } from '@nestjs/common';
import { SessionModule } from 'src/shared/entities/session';
import { SessionController } from './sessions.controller';

@Module({
  imports: [SessionModule],
  controllers: [SessionController],
})
export class SessionsModule {}
