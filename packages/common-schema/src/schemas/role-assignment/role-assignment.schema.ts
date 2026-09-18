import { BigIntIdValidation } from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** RoleAssignment의 DB 필드 타입과 공통 검증입니다. */
export class RoleAssignmentSchema
	extends AbstractSchema
{
	roleAssignmentId!: string;

	@BigIntIdValidation({ description: "Role ID" })
	roleId!: bigint;

	@BigIntIdValidation({ description: "Policy ID" })
	policyId!: bigint;

	isActive!: boolean;

	priority!: number;
}
