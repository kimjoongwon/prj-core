import { VerifyTokenQuery } from "@cocrepo/command";
import { CONTEXT_KEYS, SYSTEM_ROLES } from "@cocrepo/constant";
import { VerifyTokenResponseDto } from "@cocrepo/dto";
import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ClsService } from "nestjs-cls";
import { decodeAccessToken, type SpaceTenantLike } from "./auth-support";

@QueryHandler(VerifyTokenQuery)
export class VerifyTokenUseCase implements IQueryHandler<VerifyTokenQuery> {
	constructor(private readonly cls: ClsService) {}

	async execute(): Promise<VerifyTokenResponseDto> {
		const token = this.cls.get<string>(CONTEXT_KEYS.TOKEN);
		const tenant = this.cls.get<SpaceTenantLike | undefined>(
			CONTEXT_KEYS.TENANT,
		);
		const spaceId = this.cls.get<string | undefined>(CONTEXT_KEYS.SPACE_ID);
		if (!token) {
			throw new UnauthorizedException("토큰이 존재하지 않습니다");
		}
		if (spaceId && !tenant) {
			throw new ForbiddenException("해당 Space에 대한 테넌트가 없습니다.");
		}

		const payload = decodeAccessToken(token);
		const accessTokenExpiresAt =
			((payload as { exp?: number }).exp || 0) * 1000;
		const refreshTokenExpiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
		const hasFullAccess = tenant?.role?.name === SYSTEM_ROLES.FULL_ACCESS;

		return {
			valid: true,
			accessTokenExpiresAt,
			refreshTokenExpiresAt,
			hasFullAccess,
		};
	}
}
