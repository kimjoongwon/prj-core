import type { Meta, StoryObj } from "@storybook/react";
import { OverlayMenu } from "./OverlayMenu";

const items = [
	{
		id: "dashboard",
		label: "대시보드",
		icon: "LayoutDashboard",
		hasChildren: false,
		children: [],
	},
	{
		id: "users",
		label: "사용자",
		icon: "Users",
		hasChildren: false,
		children: [],
	},
	{
		id: "settings",
		label: "설정",
		icon: "Settings",
		hasChildren: false,
		children: [],
	},
] as never;

const meta = {
	title: "widget/OverlayMenu",
	component: OverlayMenu,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
	args: {
		title: "운영 메뉴",
		items,
		selectedItemId: "users",
		onItemClick: () => undefined,
		onClose: () => undefined,
	},
} satisfies Meta<typeof OverlayMenu>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	render: (args) => (
		<div className="min-h-[520px]">
			<OverlayMenu {...args} />
		</div>
	),
};
