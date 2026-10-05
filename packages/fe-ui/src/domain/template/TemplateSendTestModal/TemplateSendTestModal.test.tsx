import { useSendTestTemplate } from "@cocrepo/api/core/templates";
import { ModalStore } from "@cocrepo/store";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TemplateSendTestModal } from "./TemplateSendTestModal";
import { TemplateSendTestModalState } from "./TemplateSendTestModalState";

vi.mock("@cocrepo/api/core/templates", () => ({
	useSendTestTemplate: vi.fn(),
}));

const mutateAsync = vi.fn();

function createOpenSendTest() {
	const modal = new ModalStore();
	const sendTestState = new TemplateSendTestModalState({
		templateId: "template-a",
		type: "EMAIL",
		variables: [],
	});
	const modalState = modal.open({
		title: "테스트 발송",
		state: sendTestState,
		content: { kind: "component", component: TemplateSendTestModal },
	});

	return { modalState };
}

describe("TemplateSendTestModal", () => {
	beforeEach(() => {
		mutateAsync.mockReset();
		vi.mocked(useSendTestTemplate).mockReturnValue({ mutateAsync } as never);
	});

	it("자체 API로 테스트 발송을 실행하고 결과를 표시한다", async () => {
		mutateAsync.mockResolvedValue({
			data: {
				success: true,
				sentAt: "2026-07-12T10:00:00.000Z",
				errorMessage: null,
			},
		});
		const { modalState } = createOpenSendTest();
		render(<TemplateSendTestModal state={modalState} />);

		fireEvent.change(screen.getByLabelText("이메일 주소"), {
			target: { value: "test@example.com" },
		});
		fireEvent.click(screen.getByRole("button", { name: "발송" }));

		await waitFor(() => {
			expect(screen.getByText("발송 성공")).toBeInTheDocument();
		});
		expect(mutateAsync).toHaveBeenCalledWith({
			templateId: "template-a",
			data: {
				recipient: "test@example.com",
				variables: {},
			},
		});
	});
});
