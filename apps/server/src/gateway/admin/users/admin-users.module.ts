import { Module } from '@nestjs/common';
import { UsersController, UsersModule } from '@shared';

@Module({
  imports: [UsersModule],
  controllers: [UsersController],
})
export class AdminUsersModule {}
