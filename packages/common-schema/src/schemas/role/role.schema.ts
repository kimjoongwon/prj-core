import type { Role as PrismaRole } from "@cocrepo/prisma";
import {
	StringValidation,
	StringValidationOptional,
	ULIDValidation,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Role의 DB 필드 타입과 공통 검증입니다. */
export class RoleSchema extends AbstractSchema implements PrismaRole {
	@ULIDValidation()
	roleId!: PrismaRole["roleId"];

	@StringValidation({
		description: "역할 식별자",
		maxLength: 50,
		pattern: "^[A-Z][A-Z0-9_]*$",
		message:
			"역할 식별자는 영문 대문자로 시작하며, 영문 대문자, 숫자, 언더스코어만 사용 가능합니다",
	})
	name!: PrismaRole["name"];

	@StringValidationOptional({
		nullable: true,
		description: "표시명",
		maxLength: 50,
	})
	displayName!: PrismaRole["displayName"];

	@StringValidationOptional({
		nullable: true,
		description: "설명",
		maxLength: 200,
	})
	description!: PrismaRole["description"];
}
