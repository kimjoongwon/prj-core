import type { Company as PrismaCompany } from "@cocrepo/prisma";
import {
	StringValidation,
	StringValidationOptional,
	UUIDValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Company의 DB 필드 타입과 공통 검증입니다. */
export class CompanySchema extends AbstractSchema implements PrismaCompany {
	companyId!: PrismaCompany["companyId"];

	@StringValidation()
	name!: PrismaCompany["name"];

	@StringValidationOptional({ nullable: true })
	label!: PrismaCompany["label"];

	@StringValidation()
	address!: PrismaCompany["address"];

	@StringValidation()
	phone!: PrismaCompany["phone"];

	@StringValidation()
	email!: PrismaCompany["email"];

	@StringValidation()
	businessNo!: PrismaCompany["businessNo"];

	@UUIDValidationOptional({ nullable: true })
	logoImageFileId!: PrismaCompany["logoImageFileId"];
}
