import { AuthFacade } from "@cocrepo/facade";
import { UsersRepository } from "@cocrepo/repository";
import {
	RedisService,
	TokenService,
	TokenStorageService,
	UsersService,
} from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { AuthController, JwtStrategy, LocalStrategy } from "@shared";

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
