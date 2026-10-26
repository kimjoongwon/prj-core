import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	StringValidation,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Category의 DB 필드 타입과 공통 검증입니다. */
export class CategorySchema extends AbstractSchema {
	categoryId!: string;

	@StringValidation()
	name!: string;

	@BigIntIdValidation({ nullable: true })
	parentId!: bigint | null;

	@BigIntIdValidation()
	spaceId!: bigint;

	@BigIntIdValidationOptional({ nullable: true })
	createdById!: bigint | null;
}
