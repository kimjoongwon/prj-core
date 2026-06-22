import { BooleanFieldOptional, StringFieldOptional } from "@cocrepo/decorator";
import type { Prisma } from "@cocrepo/prisma";

import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryOidcClientDto extends PrismaQueryDto<Prisma.OidcClientWhereInput> {
	@StringFieldOptional({ description: "Client ID 또는 이름 통합 검색" })
	readonly search?: string;

	@BooleanFieldOptional({ description: "활성 상태 필터" })
	readonly isActive?: boolean;

	protected excludeFromAutoMap(): string[] {
		return ["search"];
	}

}
