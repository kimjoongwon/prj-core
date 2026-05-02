import {
	BooleanFieldOptional,
	DateFieldOptional,
	EnumField,
	EnumFieldOptional,
	NumberFieldOptional,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator";
import {
	ServiceDocumentFormat,
	ServiceDocumentKind,
	ServiceDocumentPlatform,
} from "@cocrepo/prisma";

/**
 * 서비스 문서 생성 DTO
 *
 * 문서는 기본적으로 DRAFT 상태로 생성되며 publish API로 게시합니다.
 */
export class CreateServiceDocumentDto {
	@EnumField(() => ServiceDocumentKind, { description: "문서 종류" })
	kind!: ServiceDocumentKind;

	@EnumFieldOptional(() => ServiceDocumentPlatform, {
		description: "노출 플랫폼",
	})
	platform?: ServiceDocumentPlatform;

	@StringFieldOptional({ description: "로케일" })
	locale?: string;

	@StringField({ description: "제목" })
	title!: string;

	@StringFieldOptional({ description: "요약" })
	summary?: string;

	@StringField({ description: "본문" })
	content!: string;

	@EnumFieldOptional(() => ServiceDocumentFormat, {
		description: "본문 형식",
	})
	format?: ServiceDocumentFormat;

	@StringField({ description: "버전" })
	version!: string;

	@BooleanFieldOptional({ description: "필수 동의 여부" })
	isRequired?: boolean;

	@NumberFieldOptional({ int: true, description: "정렬 순서" })
	displayOrder?: number;

	@DateFieldOptional({ description: "효력 시작 시각" })
	effectiveAt?: Date;
}
