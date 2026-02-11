import { StringFieldOptional } from "@cocrepo/decorator";
import type { Prisma } from "@cocrepo/prisma";

import { PrismaQueryDto } from "./prisma-query.dto";

export class QueryOidcSessionDto extends PrismaQueryDto<Prisma.OidcModelWhereInput> {
	@StringFieldOptional({ description: "모델 타입 필터 (AccessToken, RefreshToken, Session 등)" })
	readonly modelType?: string;
}
