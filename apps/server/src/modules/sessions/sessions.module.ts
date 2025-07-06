import { Module } from '@nestjs/common';
import { SessionsController } from '../../shared';

@Module({
  controllers: [SessionsController],
})
export class SessionsModule {}
