import { CONTEXT_KEYS } from "@cocrepo/constant";
import type { TenantDto, UserDto } from "@cocrepo/dto";
import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ClsService } from "nestjs-cls";
import type { Observable } from "rxjs";
import { canAccessAllSpaces } from "../util/permission.util";
import { SPACE_SCOPE_KEY, SpaceScope } from "./space-scope.decorator";

/**
 * Space 스코프 인터셉터
 *
 * RequestContextMiddleware 이후에 실행되며,
 * 슈퍼매니저 여부와 데코레이터(@OnlyMySpace)를 기반으로
 * EFFECTIVE_SPACE_IDS를 CLS에 저장합니다.
 *
 * - 슈퍼매니저 (ROOT Category Tenant) → undefined (전체 조회)
 * - @OnlyMySpace → 현재 X-Space-ID 1개만
 * - 기본/데코레이터 없음 → user.tenants의 모든 spaceId (Tenant 기반)
 */
@Injectable()
export class SpaceScopeInterceptor implements NestInterceptor {
	constructor(
		private readonly cls: ClsService,
		private readonly reflector: Reflector,
	) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		const user = this.cls.get<UserDto>(CONTEXT_KEYS.AUTH_USER);
		const tenant = this.cls.get<TenantDto>(CONTEXT_KEYS.TENANT);
		const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);

		// 슈퍼매니저 확인 (ROOT Category Tenant)
		if (tenant && canAccessAllSpaces(tenant)) {
			// 슈퍼매니저: undefined = 전체 조회
			this.cls.set(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS, undefined);
			return next.handle();
		}

		// 데코레이터 확인
		const scope = this.reflector.get<SpaceScope>(
			SPACE_SCOPE_KEY,
			context.getHandler(),
		);

		if (scope === SpaceScope.CURRENT) {
			// @OnlyMySpace: 현재 Space ID만
			this.cls.set(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS, spaceId ? [spaceId] : []);
		} else {
			// 기본: 사용자의 Tenant spaceIds (user.tenants 기반)
			const accessibleSpaceIds = user?.tenants?.map((t) => t.spaceId) ?? [];
			this.cls.set(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS, accessibleSpaceIds);
		}

		return next.handle();
	}
}
