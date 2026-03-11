import { UsersApplicationService } from "@cocrepo/app";
import { UsersRepository } from "@cocrepo/repository";
import {
	AuthCacheService,
	AuthContext,
	SpaceContext,
	UsersService,
} from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";

@Module({
	providers: [
		UsersApplicationService,
		UsersService,
		UsersRepository,
		AuthContext,
		SpaceContext,
		AuthCacheService,
	],
	controllers: [UsersController],
	exports: [UsersApplicationService, UsersService],
})
export class UsersModule {}
