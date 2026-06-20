import { AbilityAggregate } from "@cocrepo/aggregate";
import { GetMyAbilitiesQuery } from "@cocrepo/command";
import { CONTEXT_KEYS, USER_ERRORS } from "@cocrepo/constant";
import { type UserDto } from "@cocrepo/dto";
import { Logger, UnauthorizedException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ClsService } from "nestjs-cls";

@QueryHandler(GetMyAbilitiesQuery)
export class GetMyAbilitiesUseCase
	implements IQueryHandler<GetMyAbilitiesQuery>
{
	private readonly logger = new Logger(GetMyAbilitiesUseCase.name);

	constructor(
		private readonly abilitiesService: AbilityAggregate,
		private readonly cls: ClsService,
	) {}

	execute(): Promise<unknown> {
		const user = this.cls.get<UserDto | undefined>(CONTEXT_KEYS.AUTH_USER);
		if (!user?.id) {
			throw new UnauthorizedException(USER_ERRORS.USER_NOT_FOUND);
		}

		const spaceId = this.cls.get<string | undefined>(CONTEXT_KEYS.SPACE_ID);
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}

		const roleIds = Array.from(
			new Set(
				(user.tenants ?? [])
					.filter((tenant) => tenant.spaceId === spaceId)
					.map((tenant) => tenant.roleId)
					.filter((roleId): roleId is string => Boolean(roleId)),
			),
		);

		this.logger.debug(
			`현재 사용자 권한 조회: userId=${user.id.slice(-8)}, spaceId=${spaceId.slice(-8)}, roleIds=${roleIds.length}`,
		);

		return this.abilitiesService.getMergedAbilities(roleIds, user.id, spaceId);
	}
}
