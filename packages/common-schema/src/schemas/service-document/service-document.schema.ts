import {
	ServiceDocumentFormat,
	ServiceDocumentKind,
	ServiceDocumentPlatform,
	ServiceDocumentStatus,
} from "@cocrepo/enum";
import type { ServiceDocument as PrismaServiceDocument } from "@cocrepo/prisma";
import {
	BooleanValidation,
	DateValidationOptional,
	EnumValidation,
	NumberValidation,
	StringValidation,
	StringValidationOptional,
} from "../../decorators/model-validation";
import { AbstractSchema } from "../abstract.schema";

/** ServiceDocument의 DB 필드 타입과 공통 검증입니다. */
export class ServiceDocumentSchema
	extends AbstractSchema
	implements PrismaServiceDocument
{
	serviceDocumentId!: PrismaServiceDocument["serviceDocumentId"];

	@EnumValidation(() => ServiceDocumentKind, { description: "문서 종류" })
	kind!: PrismaServiceDocument["kind"];

	@EnumValidation(() => ServiceDocumentPlatform, { description: "노출 플랫폼" })
	platform!: PrismaServiceDocument["platform"];

	@StringValidation({ description: "로케일" })
	locale!: PrismaServiceDocument["locale"];

	@StringValidation({ description: "제목" })
	title!: PrismaServiceDocument["title"];

	@StringValidationOptional({ nullable: true, description: "요약" })
	summary!: PrismaServiceDocument["summary"];

	@StringValidation({ description: "본문" })
	content!: PrismaServiceDocument["content"];

	@EnumValidation(() => ServiceDocumentFormat, { description: "본문 형식" })
	format!: PrismaServiceDocument["format"];

	@StringValidation({ description: "버전" })
	version!: PrismaServiceDocument["version"];

	@EnumValidation(() => ServiceDocumentStatus, { description: "상태" })
	status!: PrismaServiceDocument["status"];

	@BooleanValidation({ description: "필수 동의 여부" })
	isRequired!: PrismaServiceDocument["isRequired"];

	@NumberValidation({ int: true, description: "정렬 순서" })
	displayOrder!: PrismaServiceDocument["displayOrder"];

	@DateValidationOptional({ nullable: true, description: "효력 시작 시각" })
	effectiveAt!: PrismaServiceDocument["effectiveAt"];

	@DateValidationOptional({ nullable: true, description: "게시 시각" })
	publishedAt!: PrismaServiceDocument["publishedAt"];
}
