import { describe, expect, it } from "vitest";
import { TemplateSendTestModalState } from "./TemplateSendTestModalState";

describe("TemplateSendTestModalState", () => {
	it("수신자가 없거나 발송 중이면 발송을 차단한다", () => {
		const state = new TemplateSendTestModalState({
			templateId: "template-a",
			type: "EMAIL",
			variables: [],
		});

		expect(state.isSendDisabled).toBe(true);
		state.setRecipient("test@example.com");
		expect(state.isSendDisabled).toBe(false);
		state.startSend();
		expect(state.isSendDisabled).toBe(true);
	});

	it("API 결과의 성공 여부로 발송 상태를 확정한다", () => {
		const state = new TemplateSendTestModalState({
			templateId: "template-a",
			type: "SMS",
			variables: [],
		});

		state.completeSend({
			success: true,
			sentAt: "2026-07-12T10:00:00.000Z",
			errorMessage: null,
		});

		expect(state.status).toBe("success");
		expect(state.result?.success).toBe(true);
	});
});
