import type { GetUsersBySpaceQueryInput } from "@cocrepo/input";

export class GetUsersBySpaceQuery implements GetUsersBySpaceQueryInput {
	readonly search?: GetUsersBySpaceQueryInput["search"];
	readonly name?: GetUsersBySpaceQueryInput["name"];
	readonly email?: GetUsersBySpaceQueryInput["email"];
	readonly phone?: GetUsersBySpaceQueryInput["phone"];
	readonly nickname?: GetUsersBySpaceQueryInput["nickname"];
	readonly role?: GetUsersBySpaceQueryInput["role"];
	readonly roles?: GetUsersBySpaceQueryInput["roles"];
	readonly status?: GetUsersBySpaceQueryInput["status"];
	readonly isActive?: GetUsersBySpaceQueryInput["isActive"];
	readonly isRemoved?: GetUsersBySpaceQueryInput["isRemoved"];
	readonly categoryId?: GetUsersBySpaceQueryInput["categoryId"];
	readonly groupIds?: GetUsersBySpaceQueryInput["groupIds"];
	readonly createdFrom?: GetUsersBySpaceQueryInput["createdFrom"];
	readonly createdTo?: GetUsersBySpaceQueryInput["createdTo"];
	readonly sort?: GetUsersBySpaceQueryInput["sort"];
	readonly skip?: GetUsersBySpaceQueryInput["skip"];
	readonly take?: GetUsersBySpaceQueryInput["take"];

	constructor(input: GetUsersBySpaceQueryInput) {
		Object.assign(this, input);
	}
}
