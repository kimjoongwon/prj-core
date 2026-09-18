import {
	BigIntIdValidation,
	StringValidation,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Policy의 DB 필드 타입과 공통 검증입니다. */
export class PolicySchema extends AbstractSchema {
	policyId!: string;

	@BigIntIdValidation({ description: "Space ID" })
	spaceId!: bigint;

	@BigIntIdValidation({ nullable: true, description: "생성자 ID" })
	createdById!: bigint | null;

	@StringValidation({ description: "정책 식별자" })
	name!: string;

	displayName!: string | null;

	description!: string | null;
}
