import {
	StringValidation,
	StringValidationOptional,
	UUIDValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Company의 DB 필드 타입과 공통 검증입니다. */
export class CompanySchema extends AbstractSchema {
	companyId!: string;

	@StringValidation()
	name!: string;

	@StringValidationOptional({ nullable: true })
	label!: string | null;

	@StringValidation()
	address!: string;

	@StringValidation()
	phone!: string;

	@StringValidation()
	email!: string;

	@StringValidation()
	businessNo!: string;

	@UUIDValidationOptional({ nullable: true })
	logoImageFileId!: string | null;
}
