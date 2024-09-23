import { Module } from '@nestjs/common';
import { SessionsController } from './sessions.controller';
import { SessionsModule } from '@shared';

@Module({
  imports: [SessionsModule],
  controllers: [SessionsController],
})
export class AdminSessionsModule {}
