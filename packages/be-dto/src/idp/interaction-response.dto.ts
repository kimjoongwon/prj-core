import {
	BooleanField,
	BooleanFieldOptional,
	NumberFieldOptional,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

/**
 * 인터랙션 클라이언트 정보
 */
export class InteractionClientDto {
	@StringField({ description: "클라이언트 ID" })
	clientId!: string;

	@StringField({ description: "클라이언트 이름" })
	clientName!: string;

	@StringFieldOptional({ description: "로고 URI" })
	logoUri?: string;
}

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

/**
 * POST /api/interaction/:uid/login 성공 응답
 */
export class LoginSuccessDto {
	@StringField({ description: "리다이렉트 URL" })
	redirectTo!: string;

	@BooleanFieldOptional({ description: "비밀번호 변경 필요 여부" })
	mustChangePassword?: boolean;
}

/**
 * POST /api/interaction/:uid/login 실패 응답
 */
export class LoginErrorDto {
	@StringField({ description: "에러 코드" })
	error!: string;

	@NumberFieldOptional({ description: "남은 시도 횟수" })
	remainingAttempts?: number;

	@StringFieldOptional({ description: "잠금 해제 시간 (ISO 8601)" })
	lockedUntil?: string;

	@NumberFieldOptional({ description: "임시 잠금 임계값" })
	temporaryLockThreshold?: number;

	@NumberFieldOptional({ description: "임시 잠금 시간 (분)" })
	temporaryLockDurationMin?: number;
}

/**
 * POST /api/interaction/:uid/confirm 응답
 */
export class ConsentResultDto {
	@StringField({ description: "리다이렉트 URL" })
	redirectTo!: string;
}

/**
 * POST /api/interaction/:uid/abort 응답
 */
export class AbortResultDto {
	@StringField({ description: "리다이렉트 URL" })
	redirectTo!: string;
}
