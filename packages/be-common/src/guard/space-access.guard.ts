import { CONTEXT_KEYS } from "@cocrepo/constant";
import { PUBLIC_ROUTE_KEY, SKIP_SPACE_CHECK_KEY } from "@cocrepo/decorator";
import { TenantDto, UserDto } from "@cocrepo/dto";
import {
	BadRequestException,
	type CanActivate,
	type ExecutionContext,
	ForbiddenException,
	Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ClsService } from "nestjs-cls";

@Injectable()
export class SpaceAccessGuard implements CanActivate {
	constructor(
		private readonly reflector: Reflector,
		private readonly cls: ClsService,
	) {}

	canActivate(context: ExecutionContext): boolean {
		// @PublicRoute이면 skip
		const isPublic = this.reflector.get<boolean>(
			PUBLIC_ROUTE_KEY,
			context.getHandler(),
		);
		if (isPublic) return true;

		// @SkipSpaceCheck이면 skip (인증은 필요하지만 Space 선택이 불필요한 엔드포인트)
		const skipSpaceCheck = this.reflector.get<boolean>(
			SKIP_SPACE_CHECK_KEY,
			context.getHandler(),
		);
		if (skipSpaceCheck) return true;

		const user = this.cls.get<UserDto | undefined>(CONTEXT_KEYS.AUTH_USER);

		// 인증되지 않은 요청은 skip (JwtAuthGuard가 이미 처리)
		if (!user) return true;

		// CLS에서 spaceId 확인
		const spaceId = this.cls.get<string | undefined>(CONTEXT_KEYS.SPACE_ID);
		if (!spaceId) {
			throw new BadRequestException(
				"X-Space-ID 헤더가 필요합니다. Space를 선택해주세요.",
			);
		}

		// Tenant 접근 권한 확인
		if (!user.tenants || !Array.isArray(user.tenants)) return true;

		const tenant = user.tenants.find(
			(t: TenantDto) => t.spaceId === spaceId,
		);
		if (!tenant) {
			throw new ForbiddenException(
				"해당 Space에 대한 접근 권한이 없습니다.",
			);
		}

		return true;
	}
}
