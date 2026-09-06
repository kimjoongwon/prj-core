import { GroupTypes } from "@cocrepo/enum";
import type { Group as PrismaGroup } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	EnumValidation,
	StringValidation,
	StringValidationOptional,
	ULIDValidation,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Group의 DB 필드 타입과 공통 검증입니다. */
export class GroupSchema extends AbstractSchema implements PrismaGroup {
	@ULIDValidation()
	groupId!: PrismaGroup["groupId"];

	@StringValidation()
	name!: PrismaGroup["name"];

	@EnumValidation(() => GroupTypes, { required: true })
	type!: PrismaGroup["type"];

	@StringValidationOptional({ nullable: true })
	label!: PrismaGroup["label"];

	@BigIntIdValidation()
	spaceId!: PrismaGroup["spaceId"];

	@BigIntIdValidationOptional({ nullable: true })
	createdById!: PrismaGroup["createdById"];
}
