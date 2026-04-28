import { BooleanField, DateField, StringField } from "@cocrepo/decorator";

/**
 * 인증 세션 정보 DTO
 * 멀티 디바이스 세션 목록 조회 응답용
 */
export class AuthSessionInfoDto {
	@StringField({ description: "세션 ID" })
	sessionId!: string;

	@StringField({ description: "User Agent" })
	userAgent!: string;

	@StringField({ description: "IP 주소" })
	ipAddress!: string;

	@DateField({ description: "세션 생성일" })
	createdAt!: string;

	@DateField({ description: "마지막 활동 시간" })
	lastActivityAt!: string;

	@BooleanField({ description: "현재 세션 여부" })
	isCurrent!: boolean;
}
