import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Task의 DB 필드 타입과 공통 검증입니다. */
export class TaskSchema extends AbstractSchema {
	id!: string;

	@BigIntIdValidation()
	spaceSeq!: bigint;

	@BigIntIdValidationOptional({ nullable: true })
	createdBySeq!: bigint | null;
}
