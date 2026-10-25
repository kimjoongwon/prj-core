import { CONTEXT_KEYS } from "@cocrepo/constant";
import { PUBLIC_ROUTE_KEY, SKIP_SPACE_CHECK_KEY } from "@cocrepo/decorator";
import { SpacesRepository } from "@cocrepo/repository";
import { type ContextTenantSnapshot, SpaceResourceScope } from "@cocrepo/type";
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
import { resolveTenantSpaceId } from "../util/permission.util";
import { SPACE_SCOPE_KEY } from "./space-scope.decorator";

/**
 * Space 스코프 인터셉터
 *
 * RequestContextMiddleware 이후에 실행되며,
 * 현재 선택된 Tenant의 Space와 Controller 데코레이터를 기반으로
 * EFFECTIVE_SPACE_IDS를 CLS에 저장합니다.
 *
 * - 기본값 → 현재 Space + 하위 Space
 * - @WithAncestorSpaces → 현재 Space + 상위 Space
 * - @WithSpaceTree → 현재 Space + 상위/하위 Space
 */
@Injectable()
export class SpaceScopeInterceptor implements NestInterceptor {
	constructor(
		private readonly cls: ClsService,
		private readonly reflector: Reflector,
		private readonly spacesRepository: SpacesRepository,
	) {}

	async intercept(
		context: ExecutionContext,
		next: CallHandler,
	): Promise<Observable<unknown>> {
		const tenant = this.cls.get<ContextTenantSnapshot>(CONTEXT_KEYS.TENANT);
		const tenantId = this.cls.get<string>(CONTEXT_KEYS.TENANT_ID);
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

		if (shouldEnforceSpace && !tenantId) {
			throw new BadRequestException(
				"x-tenant-id 헤더가 필요합니다. Tenant를 선택해주세요.",
			);
		}

		if (shouldEnforceSpace && !tenant) {
			throw new ForbiddenException("해당 Tenant에 대한 접근 권한이 없습니다.");
		}

		const effectiveSpaceId = tenant
			? (resolveTenantSpaceId(tenant) ?? spaceId)
			: spaceId;
		const resourceScope = this.resolveResourceScope(context);
		const effectiveSpaceIds = effectiveSpaceId
			? await this.spacesRepository.findSpaceIdsByCategoryHierarchy(
					effectiveSpaceId,
					resourceScope,
				)
			: [];

		this.cls.set(
			CONTEXT_KEYS.EFFECTIVE_SPACE_IDS,
			effectiveSpaceIds.length > 0 ? effectiveSpaceIds : [],
		);

		return next.handle();
	}

	private resolveResourceScope(context: ExecutionContext): SpaceResourceScope {
		const configuredScope =
			this.reflector.getAllAndOverride<SpaceResourceScope>(SPACE_SCOPE_KEY, [
				context.getHandler(),
				context.getClass(),
			]);

		return Object.values(SpaceResourceScope).includes(configuredScope)
			? configuredScope
			: SpaceResourceScope.WITH_DESCENDANTS;
	}
}
