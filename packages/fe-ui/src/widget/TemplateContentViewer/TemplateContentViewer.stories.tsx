import type { Meta, StoryObj } from "@storybook/react";
import { TemplateContentViewer } from "./TemplateContentViewer";

const meta = {
	title: "widget/TemplateContentViewer",
	component: TemplateContentViewer,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		type: "EMAIL",
		subject: "예약 안내",
		content: "<p>예약이 확정되었습니다.</p>",
	},
} satisfies Meta<typeof TemplateContentViewer>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Email: Story = {
	render: (args) => (
		<div className="w-[520px]">
			<TemplateContentViewer {...args} />
		</div>
	),
};
export const Sms: Story = {
	args: { type: "SMS", subject: null, content: "예약이 확정되었습니다." },
	render: Email.render,
};
export const Push: Story = {
	args: {
		type: "PUSH",
		subject: "예약 안내",
		content: "예약이 확정되었습니다.",
	},
	render: Email.render,
};
