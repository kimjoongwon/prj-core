import { UsersRepository } from "@cocrepo/repository";
import { UsersService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { UsersController } from "@shared";

@Module({
	controllers: [UsersController],
	providers: [UsersService, UsersRepository],
})
export class UsersModule {}
