import { BigIntIdValidation } from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** PolicyEntry의 DB 필드 타입과 공통 검증입니다. */
export class PolicyEntrySchema
	extends AbstractSchema
{
	policyEntryId!: string;

	@BigIntIdValidation({ description: "Policy ID" })
	policyId!: bigint;

	@BigIntIdValidation({ description: "Ability ID" })
	abilityId!: bigint;
}
