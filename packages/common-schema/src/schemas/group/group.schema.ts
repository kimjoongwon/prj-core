import { GroupTypes } from "@cocrepo/enum";
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
export class GroupSchema extends AbstractSchema {
	@ULIDValidation()
	groupId!: string;

	@StringValidation()
	name!: string;

	@EnumValidation(() => GroupTypes, { required: true })
	type!: GroupTypes;

	@StringValidationOptional({ nullable: true })
	label!: string | null;

	@BigIntIdValidation()
	spaceId!: bigint;

	@BigIntIdValidationOptional({ nullable: true })
	createdById!: bigint | null;
}
