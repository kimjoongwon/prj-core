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

	toPrismaWhere(
		baseWhere?: Partial<Prisma.OidcClientWhereInput>,
	): Prisma.OidcClientWhereInput {
		const autoWhere = super.toPrismaWhere(baseWhere);

		if (this.search) {
			autoWhere.OR = [
				{ clientId: { contains: this.search, mode: "insensitive" } },
				{ clientName: { contains: this.search, mode: "insensitive" } },
			];
		}

		return autoWhere;
	}
}
