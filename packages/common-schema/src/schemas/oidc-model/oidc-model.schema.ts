import type { JsonValue } from "@cocrepo/type";
import {
	DateValidationOptional,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { PickSchemaType } from "../../utils/mapped-schema";
import { AbstractSchema } from "../abstract.schema";

/** OidcModel의 DB 필드 타입과 공통 검증입니다. */
export class OidcModelSchema
	extends PickSchemaType(AbstractSchema, [
		"id",
		"createdAt",
		"updatedAt",
	] as const)
{
	oidcModelId!: string;

	declare id: bigint;

	declare createdAt: Date;

	declare updatedAt: Date | null;

	@StringValidation({ description: "모델 키" })
	key!: string;

	@StringValidation({ description: "모델 유형" })
	modelType!: string;

	payload!: JsonValue;

	@DateValidationOptional({ nullable: true, description: "만료 시각" })
	expiresAt!: Date | null;

	@StringValidationOptional({ nullable: true, description: "사용자 코드" })
	userCode!: string | null;

	@StringValidationOptional({ nullable: true, description: "Grant ID" })
	grantId!: string | null;

	@StringValidationOptional({ nullable: true, description: "UID" })
	uid!: string | null;
}
