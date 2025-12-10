import { Module } from "@nestjs/common";
import {
	AuthController,
	AuthDomain,
	AuthFacade,
	ContextService,
	JwtStrategy,
	LocalStrategy,
	PasswordService,
	RedisService,
	TokenService,
	TokenStorageService,
	UsersRepository,
	UsersService,
} from "@shared";

@Module({
	providers: [
		AuthDomain,
		AuthFacade,
		PasswordService,
		TokenService,
		TokenStorageService,
		RedisService,
		LocalStrategy,
		JwtStrategy,
		UsersService,
		UsersRepository,
		ContextService,
	],
	controllers: [AuthController],
	exports: [AuthFacade, TokenStorageService, RedisService],
})
export class AuthModule {}
