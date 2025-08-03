import { Module } from "@nestjs/common";
import {
	AuthController,
	AuthService,
	JwtStrategy,
	LocalStrategy,
	PasswordService,
	TokenService,
	UsersRepository,
	UsersService,
} from "@shared";

@Module({
	providers: [
		AuthService,
		PasswordService,
		TokenService,
		LocalStrategy,
		JwtStrategy,
		UsersService,
		UsersRepository,
	],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
