import { describe, expect, it } from "vitest";
import { TemplatePreviewModalState } from "./TemplatePreviewModalState";

describe("TemplatePreviewModalState", () => {
	it("변수 기본값으로 입력 상태를 초기화한다", () => {
		const state = new TemplatePreviewModalState({
			templateId: "template-a",
			variables: [
				{
					id: "name",
					name: "name",
					description: "이름",
					defaultValue: "홍길동",
					isRequired: true,
				},
			],
		});

		expect(state.variableValues).toEqual({ name: "홍길동" });
	});

	it("미리보기 성공과 실패 상태를 명확히 전환한다", () => {
		const state = new TemplatePreviewModalState({
			templateId: "template-a",
			variables: [],
		});

		state.startPreview();
		expect(state.isLoading).toBe(true);

		state.completePreview({
			type: "SMS",
			subject: null,
			content: "안녕하세요",
			unresolvedVariables: [],
		});
		expect(state.status).toBe("success");
		expect(state.result?.content).toBe("안녕하세요");

		state.failPreview("실패했습니다.");
		expect(state.status).toBe("error");
		expect(state.errorMessage).toBe("실패했습니다.");
	});
});
