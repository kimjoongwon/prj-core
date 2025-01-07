import { Module } from '@nestjs/common';
import { UsersController, UsersRepository, UsersService } from '@shared';

@Module({
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
})
export class UsersEndpointModule {}
