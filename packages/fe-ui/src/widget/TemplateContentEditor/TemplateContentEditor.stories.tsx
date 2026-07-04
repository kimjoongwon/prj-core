import type { Meta, StoryObj } from "@storybook/react";
import { TemplateContentEditor } from "./TemplateContentEditor";

const meta = {
	title: "widget/TemplateContentEditor",
	component: TemplateContentEditor,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		type: "EMAIL",
		subject: "예약 안내",
		content: "<p>{{userName}}님의 예약이 확정되었습니다.</p>",
		onSubjectChange: () => undefined,
		onContentChange: () => undefined,
	},
} satisfies Meta<typeof TemplateContentEditor>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Email: Story = {
	render: (args) => (
		<div className="w-[720px]">
			<TemplateContentEditor {...args} />
		</div>
	),
};
export const Sms: Story = {
	args: { type: "SMS", content: "{{userName}}님 예약이 확정되었습니다." },
	render: Email.render,
};
export const WithError: Story = {
	args: {
		errors: { subject: "제목을 입력하세요.", content: "본문을 입력하세요." },
	},
	render: Email.render,
};
