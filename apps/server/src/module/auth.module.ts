import { Module } from "@nestjs/common";
import {
	AuthController,
	AuthDomain,
	AuthService,
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
		AuthService,
		PasswordService,
		TokenService,
		LocalStrategy,
		JwtStrategy,
		UsersService,
		UsersRepository,
		ContextService,
	],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
