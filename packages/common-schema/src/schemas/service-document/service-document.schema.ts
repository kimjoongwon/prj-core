import {
	ServiceDocumentFormat,
	ServiceDocumentKind,
	ServiceDocumentPlatform,
	ServiceDocumentStatus,
} from "@cocrepo/enum";
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
{
	serviceDocumentId!: string;

	@EnumValidation(() => ServiceDocumentKind, { description: "문서 종류" })
	kind!: ServiceDocumentKind;

	@EnumValidation(() => ServiceDocumentPlatform, { description: "노출 플랫폼" })
	platform!: ServiceDocumentPlatform;

	@StringValidation({ description: "로케일" })
	locale!: string;

	@StringValidation({ description: "제목" })
	title!: string;

	@StringValidationOptional({ nullable: true, description: "요약" })
	summary!: string | null;

	@StringValidation({ description: "본문" })
	content!: string;

	@EnumValidation(() => ServiceDocumentFormat, { description: "본문 형식" })
	format!: ServiceDocumentFormat;

	@StringValidation({ description: "버전" })
	version!: string;

	@EnumValidation(() => ServiceDocumentStatus, { description: "상태" })
	status!: ServiceDocumentStatus;

	@BooleanValidation({ description: "필수 동의 여부" })
	isRequired!: boolean;

	@NumberValidation({ int: true, description: "정렬 순서" })
	displayOrder!: number;

	@DateValidationOptional({ nullable: true, description: "효력 시작 시각" })
	effectiveAt!: Date | null;

	@DateValidationOptional({ nullable: true, description: "게시 시각" })
	publishedAt!: Date | null;
}
