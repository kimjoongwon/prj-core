import { EnumFieldOptional, StringFieldOptional } from "@cocrepo/decorator";
import { ServiceDocumentPlatform } from "@cocrepo/prisma";

/**
 * 공개 서비스 문서 조회 Query DTO
 */
export class QueryPublicServiceDocumentDto {
	@EnumFieldOptional(() => ServiceDocumentPlatform, {
		description: "요청 플랫폼. 미지정 시 ALL 문서를 조회합니다.",
	})
	readonly platform?: ServiceDocumentPlatform;

	@StringFieldOptional({ description: "로케일" })
	readonly locale?: string;
}
