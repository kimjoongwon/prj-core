import type { Meta, StoryObj } from "@storybook/react";
import { HtmlEditor } from "./HtmlEditor";

const meta = {
	title: "widget/HtmlEditor",
	component: HtmlEditor,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		value: "<p>약관 본문을 입력하세요.</p>",
		onChange: () => undefined,
		minHeight: 240,
	},
} satisfies Meta<typeof HtmlEditor>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	render: (args) => (
		<div className="w-[720px]">
			<HtmlEditor {...args} />
		</div>
	),
};
export const Disabled: Story = {
	args: { isDisabled: true },
	render: Default.render,
};
