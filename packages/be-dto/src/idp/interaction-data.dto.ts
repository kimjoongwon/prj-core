import { BooleanField, StringField } from "@cocrepo/decorator/field";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

import { InteractionClientDto } from "./interaction-client.dto";

/**
 * GET /api/interaction/:uid 응답
 */
export class InteractionDataDto {
	@StringField({ description: "인터랙션 유형 (login | consent)" })
	type!: string;

	@StringField({ description: "인터랙션 UID" })
	uid!: string;

	@ApiPropertyOptional({
		description: "클라이언트 정보",
		type: InteractionClientDto,
		nullable: true,
	})
	client!: InteractionClientDto | null;

	@ApiProperty({
		description: "프롬프트 정보",
		type: "object",
		additionalProperties: true,
	})
	prompt!: Record<string, unknown>;

	@ApiProperty({
		description: "파라미터",
		type: "object",
		additionalProperties: true,
	})
	params!: Record<string, unknown>;

	@ApiPropertyOptional({
		description: "세션 정보",
		type: "object",
		additionalProperties: true,
	})
	session?: Record<string, unknown>;

	@BooleanField({ description: "개발 모드 여부" })
	isDev!: boolean;
}
