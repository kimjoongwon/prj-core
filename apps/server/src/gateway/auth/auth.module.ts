import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthModule as DomainAuthModule } from '@shared';

@Module({
  imports: [DomainAuthModule],
  controllers: [AuthController],
})
export class AuthModule {}
