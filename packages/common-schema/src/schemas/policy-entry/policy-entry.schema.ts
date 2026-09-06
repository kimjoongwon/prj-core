import type { PolicyEntry as PrismaPolicyEntry } from "@cocrepo/prisma";
import { BigIntIdValidation } from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** PolicyEntry의 DB 필드 타입과 공통 검증입니다. */
export class PolicyEntrySchema
	extends AbstractSchema
	implements PrismaPolicyEntry
{
	policyEntryId!: PrismaPolicyEntry["policyEntryId"];

	@BigIntIdValidation({ description: "Policy ID" })
	policyId!: PrismaPolicyEntry["policyId"];

	@BigIntIdValidation({ description: "Ability ID" })
	abilityId!: PrismaPolicyEntry["abilityId"];
}
