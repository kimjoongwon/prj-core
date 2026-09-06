import type { SpaceClassification as PrismaSpaceClassification } from "@cocrepo/prisma";
import { BigIntIdValidation } from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** SpaceClassification의 DB 필드 타입과 공통 검증입니다. */
export class SpaceClassificationSchema
	extends AbstractSchema
	implements PrismaSpaceClassification
{
	spaceClassificationId!: PrismaSpaceClassification["spaceClassificationId"];

	@BigIntIdValidation()
	categoryId!: PrismaSpaceClassification["categoryId"];

	@BigIntIdValidation()
	spaceId!: PrismaSpaceClassification["spaceId"];
}
