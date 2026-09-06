import type { OidcModel as PrismaOidcModel } from "@cocrepo/prisma";
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
	implements PrismaOidcModel
{
	oidcModelId!: PrismaOidcModel["oidcModelId"];

	declare id: PrismaOidcModel["id"];

	declare createdAt: PrismaOidcModel["createdAt"];

	declare updatedAt: PrismaOidcModel["updatedAt"];

	@StringValidation({ description: "모델 키" })
	key!: PrismaOidcModel["key"];

	@StringValidation({ description: "모델 유형" })
	modelType!: PrismaOidcModel["modelType"];

	payload!: PrismaOidcModel["payload"];

	@DateValidationOptional({ nullable: true, description: "만료 시각" })
	expiresAt!: PrismaOidcModel["expiresAt"];

	@StringValidationOptional({ nullable: true, description: "사용자 코드" })
	userCode!: PrismaOidcModel["userCode"];

	@StringValidationOptional({ nullable: true, description: "Grant ID" })
	grantId!: PrismaOidcModel["grantId"];

	@StringValidationOptional({ nullable: true, description: "UID" })
	uid!: PrismaOidcModel["uid"];
}
