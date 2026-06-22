import {
	BooleanFieldOptional,
	EnumFieldOptional,
	StringFieldOptional,
} from "@cocrepo/decorator";
import type { Prisma } from "@cocrepo/prisma";
import {
	ServiceDocumentKind,
	ServiceDocumentPlatform,
	ServiceDocumentStatus,
} from "@cocrepo/prisma";

import { PrismaQueryDto } from "../query/prisma-query.dto";

/**
 * ServiceDocument 목록 조회용 Query DTO
 */
export class QueryServiceDocumentDto extends PrismaQueryDto<Prisma.ServiceDocumentWhereInput> {
	@StringFieldOptional({ description: "제목, 요약, 버전 통합 검색" })
	readonly search?: string;

	@EnumFieldOptional(() => ServiceDocumentKind, { description: "문서 종류" })
	readonly kind?: ServiceDocumentKind;

	@EnumFieldOptional(() => ServiceDocumentPlatform, {
		description: "노출 플랫폼",
	})
	readonly platform?: ServiceDocumentPlatform;

	@EnumFieldOptional(() => ServiceDocumentStatus, { description: "상태" })
	readonly status?: ServiceDocumentStatus;

	@StringFieldOptional({ description: "로케일" })
	readonly locale?: string;

	@BooleanFieldOptional({ description: "필수 동의 여부" })
	readonly isRequired?: boolean;

	protected excludeFromAutoMap(): string[] {
		return ["search", "locale"];
	}

}
