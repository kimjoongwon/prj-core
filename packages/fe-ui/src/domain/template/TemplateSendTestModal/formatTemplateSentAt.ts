/** 테스트 발송 시각을 한국어 날짜/시간으로 표시합니다. */
export function formatTemplateSentAt(sentAt: string): string {
	return new Date(sentAt).toLocaleString("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
}
