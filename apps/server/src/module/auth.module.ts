import { Module } from "@nestjs/common";
import {
	AuthController,
	AuthDomain,
	AuthFacade,
	ContextService,
	JwtStrategy,
	LocalStrategy,
	PasswordService,
	TokenService,
	UsersRepository,
	UsersService,
} from "@shared";

@Module({
	providers: [
		AuthDomain,
		AuthFacade,
		PasswordService,
		TokenService,
		LocalStrategy,
		JwtStrategy,
		UsersService,
		UsersRepository,
		ContextService,
	],
	controllers: [AuthController],
	exports: [AuthFacade],
})
export class AuthModule {}
