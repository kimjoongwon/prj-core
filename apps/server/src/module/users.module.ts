import { Module } from "@nestjs/common";
import { UsersController } from "@shared";

@Module({
  controllers: [UsersController],
})
export class UsersModule {}
