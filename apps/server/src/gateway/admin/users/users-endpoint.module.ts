import { Module } from '@nestjs/common';
import { UserModule, UsersController } from '@shared';
import { UsersEndpoint } from './users.endpoint';

@Module({
  imports: [UserModule],
  controllers: [UsersEndpoint, UsersController],
})
export class UsersEndpointModule {}
