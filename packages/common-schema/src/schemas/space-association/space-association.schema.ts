import type { SpaceAssociation as PrismaSpaceAssociation } from "@cocrepo/prisma";
import { BigIntIdValidation } from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** SpaceAssociation의 DB 필드 타입과 공통 검증입니다. */
export class SpaceAssociationSchema
	extends AbstractSchema
	implements PrismaSpaceAssociation
{
	spaceAssociationId!: PrismaSpaceAssociation["spaceAssociationId"];

	@BigIntIdValidation()
	spaceId!: PrismaSpaceAssociation["spaceId"];

	@BigIntIdValidation()
	groupId!: PrismaSpaceAssociation["groupId"];
}
