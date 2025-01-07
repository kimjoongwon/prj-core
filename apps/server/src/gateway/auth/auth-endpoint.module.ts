import { Module } from '@nestjs/common';
import { AuthEndpoint } from './auth.endpoint';
import { AuthModule } from '@shared';

@Module({
  imports: [AuthModule],
  controllers: [AuthEndpoint],
})
export class AuthEndpointModule {}
