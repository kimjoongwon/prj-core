import { SpaceAggregate } from "@cocrepo/aggregate";
import { SetCurrentSpaceCommand } from "@cocrepo/command";
import { CONTEXT_KEYS } from "@cocrepo/constant";
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { ClsService } from "nestjs-cls";
import { getAccessibleSpacesForUser } from "./get-accessible-spaces-for-user";
import type { AuthSpaceResult } from "./space.result";
import type { UserWithTenantsLike } from "./user-with-tenants-like";

@CommandHandler(SetCurrentSpaceCommand)
export class SetCurrentSpaceUseCase {
	constructor(
		private readonly cls: ClsService,
		private readonly spacesService: SpaceAggregate,
	) {}

	async execute(command: SetCurrentSpaceCommand): Promise<AuthSpaceResult> {
		const user = this.cls.get<UserWithTenantsLike>(CONTEXT_KEYS.AUTH_USER);
		const tenant = user?.tenants?.find(
			(tenant) => tenant.id === command.input.tenantId,
		);
		if (!tenant) {
			throw new ForbiddenException("해당 Tenant를 선택할 권한이 없습니다");
		}

		const spaces = await getAccessibleSpacesForUser(this.spacesService, user);
		const selectedSpace = spaces.find(
			(space) => space.tenantId === command.input.tenantId,
		);
		if (!selectedSpace) {
			throw new BadRequestException("선택한 Tenant의 Space를 찾을 수 없습니다");
		}

		return selectedSpace;
	}
}
