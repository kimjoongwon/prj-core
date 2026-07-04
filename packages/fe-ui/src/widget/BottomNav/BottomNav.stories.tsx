import type { Meta, StoryObj } from "@storybook/react";
import { BottomNav } from "./BottomNav";

const items = [
	{ id: "home", label: "홈", icon: "Home", hasSubMenu: false },
	{ id: "booking", label: "예약", icon: "CalendarDays", hasSubMenu: false },
	{ id: "settings", label: "설정", icon: "Settings", hasSubMenu: true },
] as const;

const meta = {
	title: "widget/BottomNav",
	component: BottomNav,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
	args: { items: [...items], activeTabId: "home", onTabClick: () => undefined },
} satisfies Meta<typeof BottomNav>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	render: (args) => (
		<div className="min-h-[220px]">
			<BottomNav {...args} />
		</div>
	),
};
export const WithDifferentActiveTab: Story = {
	args: { activeTabId: "settings" },
	render: Default.render,
};
