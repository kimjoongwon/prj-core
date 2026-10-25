import { RoleAggregate, SpaceAggregate } from "@cocrepo/aggregate";
import { UserService } from "@cocrepo/service";
import { BadRequestException, Logger } from "@nestjs/common";
import { getSignUpSpaceOrThrow } from "./get-sign-up-space-or-throw";

export async function createUserForVerifiedSignUp(params: {
	usersService: UserService;
	rolesService: RoleAggregate;
	spacesService: SpaceAggregate;
	logger: Logger;
	name: string;
	nickname?: string;
	phone: string;
	address: string;
	spaceId: string;
	email: string;
	passwordHash: string;
}): Promise<{ id: string }> {
	const userRole = await params.rolesService.getDefaultUserRole();

	if (!userRole) {
		params.logger.error("User role not found");
		throw new BadRequestException("유저 역할이 존재하지 않습니다.");
	}

	const signUpSpace = await getSignUpSpaceOrThrow(
		params.spacesService,
		params.spaceId,
	);

	const user = await params.usersService.createUserForSignUp({
		name: params.name,
		email: params.email,
		phone: params.phone,
		address: params.address,
		password: params.passwordHash,
		spaceId: signUpSpace.id,
		roleId: userRole.id,
		nickname: params.nickname,
	});

	return { id: user.id };
}
