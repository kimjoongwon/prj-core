import { CONTEXT_KEYS } from "@cocrepo/constant";
import type { TenantDto } from "@cocrepo/dto";
import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import { ClsService } from "nestjs-cls";
import type { Observable } from "rxjs";
import { canAccessAllSpaces } from "../util/permission.util";

/**
 * Space 스코프 인터셉터
 *
 * RequestContextMiddleware 이후에 실행되며,
 * 현재 선택된 Tenant 역할과 selectedSpaceId 쿠키를 기반으로
 * EFFECTIVE_SPACE_IDS를 CLS에 저장합니다.
 *
 * - FULL_ACCESS → undefined (전체 조회)
 * - 그 외 → 현재 selectedSpaceId 1개만
 */
@Injectable()
export class SpaceScopeInterceptor implements NestInterceptor {
	constructor(private readonly cls: ClsService) {}

	intercept(
		_context: ExecutionContext,
		next: CallHandler,
	): Observable<unknown> {
		const tenant = this.cls.get<TenantDto>(CONTEXT_KEYS.TENANT);
		const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);

		if (tenant && canAccessAllSpaces(tenant)) {
			this.cls.set(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS, undefined);
			return next.handle();
		}

		// 비 FULL_ACCESS 사용자는 scope 데코레이터와 무관하게 현재 선택한 Space만 사용합니다.
		this.cls.set(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS, spaceId ? [spaceId] : []);

		return next.handle();
	}
}
