import { Module } from "@nestjs/common";
import { UsersController, UsersRepository, UsersService } from "@shared";

@Module({
	controllers: [UsersController],
	providers: [UsersService, UsersRepository],
})
export class UsersModule {}
