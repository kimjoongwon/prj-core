import { JwtStrategy, LocalStrategy } from "@cocrepo/be-common";
import { AuthFacade } from "@cocrepo/facade";
import { UsersRepository } from "@cocrepo/repository";
import {
	RedisService,
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
		LocalStrategy,
		JwtStrategy,
		UsersService,
		UsersRepository,
	],
	controllers: [AuthController],
	exports: [AuthFacade, TokenStorageService, RedisService],
})
export class AuthModule {}
