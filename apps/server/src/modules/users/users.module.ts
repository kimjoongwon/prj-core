import { Module } from '@nestjs/common';
import { UsersController, UsersRepository, UsersService } from '@shared/backend';

@Module({
  providers: [UsersService, UsersRepository],
  controllers: [UsersController],
})
export class UsersModule {}
