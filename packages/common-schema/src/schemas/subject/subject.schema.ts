import type { Subject as PrismaSubject } from "@cocrepo/prisma";
import {
	NumberValidation,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Subject의 DB 필드 타입과 공통 검증입니다. */
export class SubjectSchema extends AbstractSchema implements PrismaSubject {
	subjectId!: PrismaSubject["subjectId"];

	@StringValidation()
	name!: PrismaSubject["name"];

	@StringValidationOptional({ nullable: true })
	displayName!: PrismaSubject["displayName"];

	@StringValidationOptional({ nullable: true })
	icon!: PrismaSubject["icon"];

	@NumberValidation()
	order!: PrismaSubject["order"];

	@StringValidationOptional({ nullable: true })
	group!: PrismaSubject["group"];
}
