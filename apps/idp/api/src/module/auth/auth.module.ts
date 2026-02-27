import { AuthFacade } from "@cocrepo/facade";
import {
	AuthAuditLogsRepository,
	RolesRepository,
	SpacesRepository,
	UsersRepository,
} from "@cocrepo/repository";
import {
	AuthAuditLogService,
	AuthCacheService,
	EmailService,
	JwtStrategy,
	RedisService,
	RolesService,
	SpaceContext,
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
		AuthAuditLogService,
		AuthAuditLogsRepository,
		AuthCacheService,
		EmailService,
	],
	controllers: [AuthController],
	exports: [AuthFacade, TokenStorageService, RedisService],
})
export class AuthModule {}
