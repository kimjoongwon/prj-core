import { CONTEXT_KEYS } from "@cocrepo/constant";
import {
	type CallHandler,
	type ExecutionContext,
	Injectable,
	type NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Observable } from "rxjs";
import { ClsService } from "nestjs-cls";
import { SPACE_SCOPE_KEY, SpaceScope } from "./space-scope.decorator";

/**
 * Space 스코프 인터셉터
 *
 * RequestContextMiddleware 이후에 실행되며,
 * Controller 데코레이터(@OnlyMySpace, @AccessibleSpaces)를 읽어
 * EFFECTIVE_SPACE_IDS를 CLS에 저장합니다.
 *
 * - @OnlyMySpace → 현재 X-Space-ID 1개만
 * - @AccessibleSpaces 또는 데코레이터 없음 → descendantSpaceIds (카테고리 계층 기반)
 */
@Injectable()
export class SpaceScopeInterceptor implements NestInterceptor {
	constructor(
		private readonly cls: ClsService,
		private readonly reflector: Reflector,
	) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const scope = this.reflector.get<SpaceScope>(
			SPACE_SCOPE_KEY,
			context.getHandler(),
		);

		if (scope === SpaceScope.CURRENT) {
			// @OnlyMySpace: 현재 Space ID만
			const spaceId = this.cls.get<string>(CONTEXT_KEYS.SPACE_ID);
			this.cls.set(
				CONTEXT_KEYS.EFFECTIVE_SPACE_IDS,
				spaceId ? [spaceId] : [],
			);
		} else {
			// 기본 (데코레이터 없음 또는 @AccessibleSpaces): descendantSpaceIds
			const descendantIds =
				this.cls.get<string[]>(CONTEXT_KEYS.DESCENDANT_SPACE_IDS) ?? [];
			this.cls.set(CONTEXT_KEYS.EFFECTIVE_SPACE_IDS, descendantIds);
		}

		return next.handle();
	}
}
