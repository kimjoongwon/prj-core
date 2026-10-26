import {
	NumberValidation,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Subject의 DB 필드 타입과 공통 검증입니다. */
export class SubjectSchema extends AbstractSchema {
	subjectId!: string;

	@StringValidation()
	name!: string;

	@StringValidationOptional({ nullable: true })
	displayName!: string | null;

	@StringValidationOptional({ nullable: true })
	icon!: string | null;

	@NumberValidation()
	order!: number;

	@StringValidationOptional({ nullable: true })
	group!: string | null;
}
