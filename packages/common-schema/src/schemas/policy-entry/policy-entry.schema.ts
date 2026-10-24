import { BigIntIdValidation } from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** PolicyEntry의 DB 필드 타입과 공통 검증입니다. */
export class PolicyEntrySchema
	extends AbstractSchema
{
	id!: string;

	@BigIntIdValidation({ description: "Policy ID" })
	policySeq!: bigint;

	@BigIntIdValidation({ description: "Ability ID" })
	abilitySeq!: bigint;
}
