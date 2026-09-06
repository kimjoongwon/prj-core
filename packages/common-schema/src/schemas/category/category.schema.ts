import type { Category as PrismaCategory } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	BigIntIdValidationOptional,
	StringValidation,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Category의 DB 필드 타입과 공통 검증입니다. */
export class CategorySchema extends AbstractSchema implements PrismaCategory {
	categoryId!: PrismaCategory["categoryId"];

	@StringValidation()
	name!: PrismaCategory["name"];

	@BigIntIdValidation({ nullable: true })
	parentId!: PrismaCategory["parentId"];

	@BigIntIdValidation()
	spaceId!: PrismaCategory["spaceId"];

	@BigIntIdValidationOptional({ nullable: true })
	createdById!: PrismaCategory["createdById"];
}
