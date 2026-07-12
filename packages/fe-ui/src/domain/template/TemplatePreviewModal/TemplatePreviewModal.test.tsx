import { usePreviewTemplate } from "@cocrepo/api/core/templates";
import { ModalStore } from "@cocrepo/store";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TemplatePreviewModal } from "./TemplatePreviewModal";
import { TemplatePreviewModalState } from "./TemplatePreviewModalState";

vi.mock("@cocrepo/api/core/templates", () => ({
	usePreviewTemplate: vi.fn(),
}));

const mutateAsync = vi.fn();

function createOpenPreview() {
	const modal = new ModalStore();
	const previewState = new TemplatePreviewModalState({
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
	const modalState = modal.open({
		title: "템플릿 미리보기",
		state: previewState,
		content: { kind: "component", component: TemplatePreviewModal },
	});

	return { modal, modalState };
}

describe("TemplatePreviewModal", () => {
	beforeEach(() => {
		mutateAsync.mockReset();
		vi.mocked(usePreviewTemplate).mockReturnValue({ mutateAsync } as never);
	});

	it("자체 API로 미리보기를 실행하고 결과를 표시한다", async () => {
		mutateAsync.mockResolvedValue({
			data: {
				type: "EMAIL",
				subject: "환영합니다",
				content: "<p>본문</p>",
				unresolvedVariables: [],
			},
		});
		const { modalState } = createOpenPreview();
		render(<TemplatePreviewModal state={modalState} />);

		fireEvent.click(screen.getByRole("button", { name: "미리보기 실행" }));

		await waitFor(() => {
			expect(screen.getByText("환영합니다")).toBeInTheDocument();
		});
		expect(mutateAsync).toHaveBeenCalledWith({
			templateId: "template-a",
			data: { variables: { name: "홍길동" } },
		});
	});

	it("닫기 버튼은 전역 Modal을 닫는다", () => {
		const { modal, modalState } = createOpenPreview();
		render(<TemplatePreviewModal state={modalState} />);

		fireEvent.click(screen.getByRole("button", { name: "닫기" }));

		expect(modal.current).toBeNull();
	});
});
