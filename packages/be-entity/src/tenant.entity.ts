import {
	BigIntIdField,
	BooleanField,
	ClassField,
} from "@cocrepo/decorator/field";
import { Exclude } from "class-transformer";
import { AbstractEntity } from "./abstract.entity";
import { Role } from "./role.entity";
import { Space } from "./space.entity";
import { User } from "./user.entity";

export class Tenant extends AbstractEntity {
	/** 공개 식별자 ULID */
	@Exclude({ toPlainOnly: true })
	tenantId!: string;

	@BooleanField()
	main!: boolean;
	@BigIntIdField()
	spaceId!: bigint;
	@BigIntIdField()
	userId!: bigint;
	@BigIntIdField()
	roleId!: bigint;
	@ClassField(() => Space, { required: false })
	space?: Space;
	@ClassField(() => User, { required: false })
	user?: User;
	@ClassField(() => Role, { required: false })
	role?: Role;
}
