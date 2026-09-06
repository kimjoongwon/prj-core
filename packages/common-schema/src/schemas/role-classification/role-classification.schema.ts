import type { RoleClassification as PrismaRoleClassification } from "@cocrepo/prisma";
import { BigIntIdValidation } from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** RoleClassification의 DB 필드 타입과 공통 검증입니다. */
export class RoleClassificationSchema
	extends AbstractSchema
	implements PrismaRoleClassification
{
	roleClassificationId!: PrismaRoleClassification["roleClassificationId"];

	@BigIntIdValidation()
	categoryId!: PrismaRoleClassification["categoryId"];

	@BigIntIdValidation()
	roleId!: PrismaRoleClassification["roleId"];
}
