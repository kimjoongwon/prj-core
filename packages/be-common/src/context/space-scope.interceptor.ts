import { CONTEXT_KEYS } from "@cocrepo/constant";
import { PUBLIC_ROUTE_KEY, SKIP_SPACE_CHECK_KEY } from "@cocrepo/decorator";
import type { TenantDto } from "@cocrepo/dto";
import {
	BadRequestException,
	type CallHandler,
	type ExecutionContext,
	ForbiddenException,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ClsService } from "nestjs-cls";
import type { Observable } from "rxjs";
import {
	canAccessAllSpaces,
	resolveTenantSpaceId,
} from "../util/permission.util";

/**
 * Space 스코프 인터셉터
 *
 * RequestContextMiddleware 이후에 실행되며,
 * 현재 선택된 Tenant 역할과 x-space-id 헤더를 기반으로
 * EFFECTIVE_SPACE_IDS를 CLS에 저장합니다.
 *
 * - 현재 tenant role이 FULL_ACCESS → undefined (전체 조회)
 * - 그 외 → 현재 tenant의 Space 1개만
 */
@Injectable()
export class SpaceScopeInterceptor implements NestInterceptor {
	constructor(
		private readonly cls: ClsService,
		private readonly reflector: Reflector,
	) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const tenant = this.cls.get<TenantDto>(CONTEXT_KEYS.TENANT);
		const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
		const shouldEnforceSpace =
			!this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
				context.getHandler(),
				context.getClass(),
			]) &&
			!this.reflector.getAllAndOverride<boolean>(SKIP_SPACE_CHECK_KEY, [
				context.getHandler(),
				context.getClass(),
			]);

		if (shouldEnforceSpace && !spaceId) {
			throw new BadRequestException(
				"x-space-id 헤더가 필요합니다. Space를 선택해주세요.",
			);
		}

		if (shouldEnforceSpace && !tenant) {
			throw new ForbiddenException("해당 Space에 대한 테넌트가 없습니다.");
		}

		if (tenant && canAccessAllSpaces(tenant)) {
			this.cls.set(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS, undefined);
			return next.handle();
		}

		// 현재 tenant role이 FULL_ACCESS가 아니면 현재 선택한 Space만 사용합니다.
		const effectiveSpaceId = tenant
			? (resolveTenantSpaceId(tenant) ?? spaceId)
			: spaceId;
		this.cls.set(
			CONTEXT_KEYS.EFFECTIVE_SPACE_IDS,
			effectiveSpaceId ? [effectiveSpaceId] : [],
		);

		return next.handle();
	}
}
