import {
	BigIntIdField,
	ClassField,
	StringField,
	UUIDField,
} from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { User } from "./user.entity";

export class Profile extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	profileId!: string;

	@UUIDField({ nullable: true })
	avatarFileId!: string | null;
	@StringField()
	name!: string;
	@StringField()
	nickname!: string;
	@StringField()
	address!: string;
	@BigIntIdField()
	userId!: bigint;
	@ClassField(() => User, { required: false })
	user?: User;
}
