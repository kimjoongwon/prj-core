import type { JsonValue } from "@cocrepo/type";
import {
	NumberValidation,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** Action의 DB 필드 타입과 공통 검증입니다. */
export class ActionSchema extends AbstractSchema {
	actionId!: string;

	@StringValidation()
	name!: string;

	@StringValidationOptional({ nullable: true })
	displayName!: string | null;

	@StringValidationOptional({ nullable: true })
	description!: string | null;

	@StringValidationOptional({ nullable: true })
	group!: string | null;

	@NumberValidation()
	order!: number;

	config!: JsonValue;
}
