import type { RoleAssignment as PrismaRoleAssignment } from "@cocrepo/prisma";
import { BigIntIdValidation } from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** RoleAssignment의 DB 필드 타입과 공통 검증입니다. */
export class RoleAssignmentSchema
	extends AbstractSchema
	implements PrismaRoleAssignment
{
	roleAssignmentId!: PrismaRoleAssignment["roleAssignmentId"];

	@BigIntIdValidation({ description: "Role ID" })
	roleId!: PrismaRoleAssignment["roleId"];

	@BigIntIdValidation({ description: "Policy ID" })
	policyId!: PrismaRoleAssignment["policyId"];

	isActive!: PrismaRoleAssignment["isActive"];

	priority!: PrismaRoleAssignment["priority"];
}
