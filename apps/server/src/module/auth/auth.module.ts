import { JwtStrategy, SpaceContext } from "@cocrepo/be-common";
import { AuthFacade } from "@cocrepo/facade";
import {
	RolesRepository,
	SpacesRepository,
	UsersRepository,
} from "@cocrepo/repository";
import {
	RedisService,
	RolesService,
	SpacesService,
	TokenService,
	TokenStorageService,
	UsersService,
} from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";

@Module({
	providers: [
		AuthFacade,
		TokenService,
		TokenStorageService,
		RedisService,
		JwtStrategy,
		UsersService,
		UsersRepository,
		RolesService,
		RolesRepository,
		SpacesService,
		SpacesRepository,
		SpaceContext,
	],
	controllers: [AuthController],
	exports: [AuthFacade, TokenStorageService, RedisService],
})
export class AuthModule {}
