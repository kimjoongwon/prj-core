import {
	NumberFieldOptional,
	StringField,
	StringFieldOptional,
} from "@cocrepo/decorator";
import { ApiPropertyOptional } from "@nestjs/swagger";

import { LoginRecoveryActionDto } from "./login-recovery-action.dto";

/**
 * POST /api/interaction/:uid/login 실패 응답
 */
export class LoginErrorDto {
	@StringField({ description: "에러 코드" })
	error!: string;

	@StringFieldOptional({ description: "사용자 표시 메시지" })
	displayMessage?: string;

	@StringFieldOptional({ description: "추가 안내 문구" })
	hint?: string;

	@NumberFieldOptional({ description: "남은 시도 횟수" })
	remainingAttempts?: number;

	@StringFieldOptional({ description: "잠금 해제 시간 (ISO 8601)" })
	lockedUntil?: string;

	@NumberFieldOptional({ description: "임시 잠금 임계값" })
	temporaryLockThreshold?: number;

	@NumberFieldOptional({ description: "임시 잠금 시간 (분)" })
	temporaryLockDurationMin?: number;

	@ApiPropertyOptional({
		description: "사용 가능한 복구 액션",
		type: [LoginRecoveryActionDto],
	})
	recoveryActions?: LoginRecoveryActionDto[];
}
