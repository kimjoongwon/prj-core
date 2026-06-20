import { SpaceAggregate } from "@cocrepo/aggregate";
import { SetCurrentSpaceCommand } from "@cocrepo/command";
import { CONTEXT_KEYS } from "@cocrepo/constant";
import { SpaceDto, UserDto } from "@cocrepo/dto";
import { BadRequestException, ForbiddenException } from "@nestjs/common";
import { CommandHandler } from "@nestjs/cqrs";
import { ClsService } from "nestjs-cls";
import { getAccessibleSpacesForUser } from "./auth-account.support";

@CommandHandler(SetCurrentSpaceCommand)
export class SetCurrentSpaceUseCase {
	constructor(
		private readonly cls: ClsService,
		private readonly spacesService: SpaceAggregate,
	) {}

	async execute(command: SetCurrentSpaceCommand): Promise<SpaceDto> {
		const user = this.cls.get<UserDto>(CONTEXT_KEYS.AUTH_USER);
		if (
			!user?.tenants?.some((tenant) => tenant.spaceId === command.input.spaceId)
		) {
			throw new ForbiddenException("해당 Space를 선택할 권한이 없습니다");
		}

		const spaces = await getAccessibleSpacesForUser(this.spacesService, user);
		const selectedSpace = spaces.find(
			(space) => space.id === command.input.spaceId,
		);
		if (!selectedSpace) {
			throw new BadRequestException("선택한 Space를 찾을 수 없습니다");
		}

		return selectedSpace;
	}
}
