import { Module } from '@nestjs/common';
import { UserService } from '@shared';

@Module({
  providers: [UserService],
  exports: [UserService],
})
export class UsersModule {}
