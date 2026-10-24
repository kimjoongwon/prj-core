import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	StringValidation,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Category의 DB 필드 타입과 공통 검증입니다. */
export class CategorySchema extends AbstractSchema {
	id!: string;

	@StringValidation()
	name!: string;

	@BigIntIdValidation({ nullable: true })
	parentSeq!: bigint | null;

	@BigIntIdValidation()
	spaceSeq!: bigint;

	@BigIntIdValidationOptional({ nullable: true })
	createdBySeq!: bigint | null;
}
