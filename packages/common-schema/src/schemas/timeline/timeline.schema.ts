import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Timeline의 DB 필드 타입과 공통 검증입니다. */
export class TimelineSchema extends AbstractSchema {
	id!: string;

	@BigIntIdValidation()
	spaceSeq!: bigint;

	@BigIntIdValidationOptional({ nullable: true })
	createdBySeq!: bigint | null;

	@StringValidation()
	name!: string;

	@StringValidationOptional({ nullable: true })
	description!: string | null;
}
