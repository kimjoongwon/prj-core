import { Module } from "@nestjs/common";
import {
	AuthController,
	AuthService,
	ContextService,
	JwtStrategy,
	LocalStrategy,
	PasswordService,
	TokenService,
	UsersRepository,
	UsersService,
} from "@shared";
import { AuthDomain } from "@shared/service/domain/auth.domain";

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
