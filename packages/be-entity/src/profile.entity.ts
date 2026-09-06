import {
	BigIntIdFieldMetadata,
	ClassField,
	StringFieldMetadata,
	UUIDFieldMetadata,
} from "@cocrepo/decorator/field";
import { ProfileSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { User } from "./user.entity";

@AbstractEntityFields()
export class Profile extends ProfileSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare profileId: ProfileSchema["profileId"];

	@UUIDFieldMetadata({ nullable: true })
	declare avatarFileId: ProfileSchema["avatarFileId"];
	@StringFieldMetadata()
	declare name: ProfileSchema["name"];
	@StringFieldMetadata()
	declare nickname: ProfileSchema["nickname"];
	@StringFieldMetadata()
	declare address: ProfileSchema["address"];
	@BigIntIdFieldMetadata()
	declare userId: ProfileSchema["userId"];
	@ClassField(() => User, { required: false })
	user?: User;
}
