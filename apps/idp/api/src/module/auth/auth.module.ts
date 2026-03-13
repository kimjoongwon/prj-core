import { AuthApplicationService } from "@cocrepo/app";
import { OidcFacade } from "@cocrepo/integration";
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
	RoleService,
	SpaceContext,
	SpaceService,
	TokenService,
	TokenStorageService,
	UserService,
} from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";

@Module({
	providers: [
		AuthApplicationService,
		OidcFacade,
		TokenService,
		TokenStorageService,
		RedisService,
		JwtStrategy,
		UserService,
		UsersRepository,
		RoleService,
		RolesRepository,
		SpaceService,
		SpacesRepository,
		SpaceContext,
		AuthAuditLogService,
		AuthAuditLogsRepository,
		AuthCacheService,
		EmailService,
	],
	controllers: [AuthController],
	exports: [AuthApplicationService, TokenStorageService, RedisService],
})
export class AuthModule {}
