import type { UserAssociation as PrismaUserAssociation } from "@cocrepo/prisma";
import { BigIntIdValidation } from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** UserAssociation의 DB 필드 타입과 공통 검증입니다. */
export class UserAssociationSchema
	extends AbstractSchema
	implements PrismaUserAssociation
{
	userAssociationId!: PrismaUserAssociation["userAssociationId"];

	@BigIntIdValidation()
	userId!: PrismaUserAssociation["userId"];

	@BigIntIdValidation()
	groupId!: PrismaUserAssociation["groupId"];
}
