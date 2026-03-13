import { UsersRepository } from "@cocrepo/repository";
import { UserFacade } from "@cocrepo/facade";
import {
	AuthCacheService,
	AuthContext,
	SpaceContext,
	UserService,
} from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller";

@Module({
	providers: [
		UserFacade,
		UserService,
		UsersRepository,
		AuthContext,
		SpaceContext,
		AuthCacheService,
	],
	controllers: [UsersController],
	exports: [UserFacade, UserService, AuthCacheService],
})
export class UsersModule {}
