import { Profile } from "@cocrepo/entity";
import { EntityResponseType } from "./mapped-types";
import { UserDto } from "./user.dto";

export class ProfileDto extends EntityResponseType(Profile, {
	pick: [
		"id",
		"createdAt",
		"updatedAt",
		"removedAt",
		"avatarFileId",
		"name",
		"nickname",
		"address",
		"userId",
		"user",
	] as const,
	relations: {
		user: () => UserDto,
	},
}) {
	declare user?: UserDto;
}
