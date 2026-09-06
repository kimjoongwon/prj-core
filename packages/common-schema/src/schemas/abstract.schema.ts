import type { Role as PrismaRole } from "@cocrepo/prisma";
import {
	BigIntIdValidation,
	DateValidation,
} from "../decorators/model-validation";
/** DB 모델이 공유하는 식별자와 수명 주기 필드 검증입니다. */
export class AbstractSchema
	implements Pick<PrismaRole, "id" | "createdAt" | "updatedAt" | "removedAt">
{
	@BigIntIdValidation() id!: PrismaRole["id"];
	@DateValidation() createdAt!: PrismaRole["createdAt"];
	@DateValidation({ nullable: true }) updatedAt!: PrismaRole["updatedAt"];
	@DateValidation({ nullable: true }) removedAt!: PrismaRole["removedAt"];
}
