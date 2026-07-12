import type { TemplateType } from "../types";

/** 템플릿 채널별 테스트 수신자 입력 계약입니다. */
export const templateRecipientConfig: Record<
	TemplateType,
	{ label: string; placeholder: string }
> = {
	EMAIL: { label: "이메일 주소", placeholder: "test@example.com" },
	SMS: { label: "전화번호", placeholder: "010-1234-5678" },
	PUSH: { label: "디바이스 토큰", placeholder: "디바이스 토큰 입력" },
};
