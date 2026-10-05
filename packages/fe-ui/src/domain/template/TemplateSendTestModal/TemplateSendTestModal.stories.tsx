import { ModalState } from "@cocrepo/store";
import type { Meta, StoryObj } from "@storybook/react";
import { HttpResponse, http } from "msw";
import { TemplateSendTestModal } from "./TemplateSendTestModal";
import { TemplateSendTestModalState } from "./TemplateSendTestModalState";

function createModalState() {
	const sendTestState = new TemplateSendTestModalState({
		templateId: "storybook-template",
		type: "EMAIL",
		variables: [],
	});

	return new ModalState(
		{
			title: "테스트 발송",
			state: sendTestState,
			content: { kind: "component", component: TemplateSendTestModal },
		},
		(state) => state.deactivate(),
	);
}

const meta = {
	title: "domain/template/TemplateSendTestModal",
	component: TemplateSendTestModal,
	parameters: {
		layout: "centered",
		msw: {
			handlers: [
				http.post("/api/v1/templates/:templateId/send-test", () =>
					HttpResponse.json({
						data: {
							success: true,
							sentAt: "2026-07-12T10:00:00.000Z",
							errorMessage: null,
						},
					}),
				),
			],
		},
	},
	tags: ["autodocs"],
	args: { state: createModalState() },
} satisfies Meta<typeof TemplateSendTestModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
