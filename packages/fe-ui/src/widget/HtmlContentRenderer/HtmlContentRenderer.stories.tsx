import type { Meta, StoryObj } from "@storybook/react";
import { HtmlContentRenderer } from "./HtmlContentRenderer";

const meta = {
	title: "widget/HtmlContentRenderer",
	component: HtmlContentRenderer,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		html: "<h1>예약 안내</h1><p>방문 전 준비사항을 확인해 주세요.</p><ul><li>신분증 지참</li><li>10분 전 도착</li></ul>",
		maxHeight: 320,
	},
} satisfies Meta<typeof HtmlContentRenderer>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	render: (args) => (
		<div className="w-[520px]">
			<HtmlContentRenderer {...args} />
		</div>
	),
};
