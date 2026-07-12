import { ModalState } from "@cocrepo/store";
import type { Meta, StoryObj } from "@storybook/react";
import { HttpResponse, http } from "msw";
import { TemplatePreviewModal } from "./TemplatePreviewModal";
import { TemplatePreviewModalState } from "./TemplatePreviewModalState";

function createModalState() {
	const previewState = new TemplatePreviewModalState({
		templateId: "storybook-template",
		variables: [
			{
				id: "userName",
				name: "userName",
				description: "사용자 이름",
				defaultValue: "홍길동",
				isRequired: true,
			},
		],
	});

	return new ModalState(
		{
			title: "템플릿 미리보기",
			state: previewState,
			content: { kind: "component", component: TemplatePreviewModal },
		},
		(state) => state.deactivate(),
	);
}

const meta = {
	title: "domain/template/TemplatePreviewModal",
	component: TemplatePreviewModal,
	parameters: {
		layout: "centered",
		msw: {
			handlers: [
				http.post("/api/v1/templates/:templateId/preview", () =>
					HttpResponse.json({
						data: {
							type: "EMAIL",
							subject: "환영합니다",
							content: "<p>홍길동님, 환영합니다.</p>",
							unresolvedVariables: [],
						},
					}),
				),
			],
		},
	},
	tags: ["autodocs"],
	args: { state: createModalState() },
} satisfies Meta<typeof TemplatePreviewModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
