import { Module } from '@nestjs/common';
import { UsersService } from '@shared';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
