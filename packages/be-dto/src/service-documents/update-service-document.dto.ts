import {
	BooleanFieldOptional,
	DateFieldOptional,
	EnumFieldOptional,
	NumberFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator";
import { ServiceDocumentFormat } from "@cocrepo/prisma";

/**
 * 서비스 문서 수정 DTO
 *
 * kind/platform/locale/version은 버전 식별자라 수정하지 않습니다.
 */
export class UpdateServiceDocumentDto {
	@StringFieldOptional({ description: "제목" })
	title?: string;

	@StringFieldOptional({ description: "요약" })
	summary?: string;

	@StringFieldOptional({ description: "본문" })
	content?: string;

	@EnumFieldOptional(() => ServiceDocumentFormat, {
		description: "본문 형식",
	})
	format?: ServiceDocumentFormat;

	@BooleanFieldOptional({ description: "필수 동의 여부" })
	isRequired?: boolean;

	@NumberFieldOptional({ int: true, description: "정렬 순서" })
	displayOrder?: number;

	@DateFieldOptional({ description: "효력 시작 시각" })
	effectiveAt?: Date;
}
