import {
	BigIntIdFieldMetadata,
	BooleanFieldMetadata,
	ClassField,
} from "@cocrepo/decorator/field";
import { TenantSchema } from "@cocrepo/schema";
import { Exclude } from "class-transformer";
import { AbstractEntityFields } from "./abstract-entity-fields.decorator";
import { Role } from "./role.entity";
import { Space } from "./space.entity";
import { User } from "./user.entity";

@AbstractEntityFields()
export class Tenant extends TenantSchema {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	declare id: TenantSchema["id"];

	@BooleanFieldMetadata()
	main!: boolean;
	@BigIntIdFieldMetadata()
	declare spaceSeq: TenantSchema["spaceSeq"];
	@BigIntIdFieldMetadata()
	declare userSeq: TenantSchema["userSeq"];
	@BigIntIdFieldMetadata()
	declare roleSeq: TenantSchema["roleSeq"];
	@ClassField(() => Space, { required: false })
	space?: Space;
	@ClassField(() => User, { required: false })
	user?: User;
	@ClassField(() => Role, { required: false })
	role?: Role;
}
