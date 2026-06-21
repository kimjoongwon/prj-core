import { VerifyTokenQuery } from "@cocrepo/command";
import { CONTEXT_KEYS, SYSTEM_ROLES } from "@cocrepo/constant";
import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { QueryHandler } from "@nestjs/cqrs";
import { ClsService } from "nestjs-cls";
import { decodeAccessToken } from "../oidc/decode-access-token";
import type { SpaceTenantLike } from "./space-tenant-like";
import type { VerifyTokenResult } from "./verify-token.result";

@QueryHandler(VerifyTokenQuery)
export class VerifyTokenUseCase {
	constructor(private readonly cls: ClsService) {}

	async execute(): Promise<VerifyTokenResult> {
		const token = this.cls.get<string>(CONTEXT_KEYS.TOKEN);
		const tenant = this.cls.get<SpaceTenantLike | undefined>(
			CONTEXT_KEYS.TENANT,
		);
		const tenantId = this.cls.get<string | undefined>(CONTEXT_KEYS.TENANT_ID);
		if (!token) {
			throw new UnauthorizedException("토큰이 존재하지 않습니다");
		}
		if (tenantId && !tenant) {
			throw new ForbiddenException("해당 Tenant에 대한 접근 권한이 없습니다.");
		}

		const payload = decodeAccessToken(token);
		const accessTokenExpiresAt =
			((payload as { exp?: number }).exp || 0) * 1000;
		const refreshTokenExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
		const hasFullAccess = tenant?.role?.name === SYSTEM_ROLES.PLATFORM_ADMIN;

		return {
			valid: true,
			accessTokenExpiresAt,
			refreshTokenExpiresAt,
			hasFullAccess,
		};
	}
}
