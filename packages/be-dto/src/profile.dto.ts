import {
	BigIntIdField,
	ClassField,
	StringField,
	UUIDField,
} from "@cocrepo/decorator/field";
import type { DomainEntityModel } from "@cocrepo/entity";
import type { Profile } from "@cocrepo/prisma";
import { Exclude } from "class-transformer";
import { AbstractDto } from "./abstract.dto";
import { UserDto } from "./user.dto";

export class ProfileDto
	extends AbstractDto
	implements DomainEntityModel<Profile, "profileId">
{
	@Exclude()
	// biome-ignore lint/correctness/noUnusedPrivateClassMembers: class-transformer가 일반 REST 응답에서 이 필드를 제외하려면 선언이 필요합니다.
	private readonly profileId?: never;

	@UUIDField({ nullable: true })
	avatarFileId: string | null;

	@StringField()
	name: string;

	@StringField()
	nickname: string;

	@StringField()
	address: string;

	@BigIntIdField()
	userId: bigint;

	@ClassField(() => UserDto, { required: false })
	user?: UserDto;
}
