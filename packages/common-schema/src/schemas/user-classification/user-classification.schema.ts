import type { UserClassification as PrismaUserClassification } from "@cocrepo/prisma";
import { BigIntIdValidation } from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** UserClassification의 DB 필드 타입과 공통 검증입니다. */
export class UserClassificationSchema
	extends AbstractSchema
	implements PrismaUserClassification
{
	userClassificationId!: PrismaUserClassification["userClassificationId"];

	@BigIntIdValidation()
	categoryId!: PrismaUserClassification["categoryId"];

	@BigIntIdValidation()
	userId!: PrismaUserClassification["userId"];
}
