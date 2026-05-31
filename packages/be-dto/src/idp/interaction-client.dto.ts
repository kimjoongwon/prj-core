import { StringField, StringFieldOptional } from "@cocrepo/decorator";
import type { Prisma } from "@cocrepo/prisma";
import { ApiPropertyOptional } from "@nestjs/swagger";

/**
 * 인터랙션 클라이언트 정보
 */
export class InteractionClientDto {
	@StringField({ description: "클라이언트 ID" })
	clientId!: string;

	@StringField({ description: "클라이언트 이름" })
	name!: string;

	@StringFieldOptional({ description: "로고 URI" })
	logoUri?: string;

	@ApiPropertyOptional({
		description: "로그인 화면 표시 설정",
		type: "object",
		additionalProperties: true,
		nullable: true,
	})
	loginUi?: Prisma.JsonValue | null;
}
