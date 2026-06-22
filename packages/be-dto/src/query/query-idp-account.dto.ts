import { BooleanFieldOptional, StringFieldOptional } from "@cocrepo/decorator";
import type { Prisma } from "@cocrepo/prisma";
import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryIdpAccountDto extends PrismaQueryDto<Prisma.UserWhereInput> {
	@StringFieldOptional({ description: "이름 또는 이메일 검색" })
	readonly search?: string;

	@BooleanFieldOptional({ description: "활성 상태 필터" })
	readonly isActive?: boolean;

	@BooleanFieldOptional({ description: "잠금 상태 필터" })
	readonly isLocked?: boolean;

	protected excludeFromAutoMap(): string[] {
		return ["search", "isLocked"];
	}

}
