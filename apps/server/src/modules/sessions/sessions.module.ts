import { Module } from '@nestjs/common';
import { SessionsController } from '@shared/backend';

@Module({
  controllers: [SessionsController],
})
export class SessionsModule {}
