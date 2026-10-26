import { AbilityAggregate } from "@cocrepo/aggregate";
import { GetMyAbilitiesQuery } from "@cocrepo/command";
import { CONTEXT_KEYS, USER_ERRORS } from "@cocrepo/constant";
import type { ContextTenantSnapshot, ContextUserSnapshot } from "@cocrepo/type";
import { Logger, UnauthorizedException } from "@nestjs/common";
import { QueryHandler } from "@nestjs/cqrs";
import { ClsService } from "nestjs-cls";

@QueryHandler(GetMyAbilitiesQuery)
export class GetMyAbilitiesUseCase {
	private readonly logger = new Logger(GetMyAbilitiesUseCase.name);

	constructor(
		private readonly abilitiesService: AbilityAggregate,
		private readonly cls: ClsService,
	) {}

	execute(): Promise<unknown> {
		const user = this.cls.get<ContextUserSnapshot | undefined>(
			CONTEXT_KEYS.AUTH_USER,
		);
		if (!user?.id) {
			throw new UnauthorizedException(USER_ERRORS.USER_NOT_FOUND);
		}

		const tenant = this.cls.get<ContextTenantSnapshot | undefined>(
			CONTEXT_KEYS.TENANT,
		);
		if (!tenant?.id) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		const roleIds = tenant.roleId ? [tenant.roleId] : [];
		const spaceId = tenant.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		this.logger.debug(
			`현재 사용자 권한 조회: userId=${user.id.toString()}, tenantId=${tenant.id.toString()}, roleIds=${roleIds.length}`,
		);

		return this.abilitiesService.getMergedAbilities(roleIds, spaceId);
	}
}
