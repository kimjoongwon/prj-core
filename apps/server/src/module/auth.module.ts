import { Module } from "@nestjs/common";
import {
	AuthController,
	AuthService,
	JwtStrategy,
	LocalStrategy,
	PasswordService,
	TokenService,
} from "@shared";

@Module({
	providers: [
		AuthService,
		PasswordService,
		TokenService,
		LocalStrategy,
		JwtStrategy,
	],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
