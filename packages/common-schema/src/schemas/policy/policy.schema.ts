import {
	BigIntIdValidation,
	StringValidation,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Policy의 DB 필드 타입과 공통 검증입니다. */
export class PolicySchema extends AbstractSchema {
	id!: string;

	@BigIntIdValidation({ description: "Space ID" })
	spaceSeq!: bigint;

	@BigIntIdValidation({ nullable: true, description: "생성자 ID" })
	createdBySeq!: bigint | null;

	@StringValidation({ description: "정책 식별자" })
	name!: string;

	displayName!: string | null;

	description!: string | null;
}
