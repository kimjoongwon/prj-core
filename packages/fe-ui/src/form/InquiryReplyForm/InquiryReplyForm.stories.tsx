import type { Meta, StoryObj } from "@storybook/react";
import { InquiryReplyForm } from "./InquiryReplyForm";

const meta = {
	title: "form/InquiryReplyForm",
	component: InquiryReplyForm,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		onSubmit: () => undefined,
		onSearchKnowledge: () => undefined,
		draftContent: "확인 후 다시 안내드리겠습니다.",
	},
} satisfies Meta<typeof InquiryReplyForm>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	render: (args) => (
		<div className="w-[640px]">
			<InquiryReplyForm {...args} />
		</div>
	),
};
export const Sending: Story = {
	args: { isSending: true },
	render: Default.render,
};
