import type { Meta, StoryObj } from "@storybook/react";
import { SidePanel } from "./SidePanel";

const navItems = [
	{
		id: "dashboard",
		label: "대시보드",
		icon: "LayoutDashboard",
		hasChildren: false,
		children: [],
	},
	{
		id: "members",
		label: "회원",
		icon: "Users",
		hasChildren: true,
		children: [
			{
				id: "member-list",
				label: "회원 목록",
				icon: "Users",
				hasChildren: false,
				children: [],
			},
			{
				id: "role-list",
				label: "권한",
				icon: "Shield",
				hasChildren: false,
				children: [],
			},
		],
	},
	{
		id: "settings",
		label: "설정",
		icon: "Settings",
		hasChildren: false,
		children: [],
	},
] as const;

const selectedNavItem = navItems[1];
const selectedSubNavItem = selectedNavItem.children[0];

const meta = {
	title: "widget/SidePanel",
	component: SidePanel,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
	args: {
		navItems: navItems as never,
		selectedNavItem: selectedNavItem as never,
		selectedSubNavItem: selectedSubNavItem as never,
		expandedNavItemIds: new Set(["members"]),
		onNavItemClick: () => undefined,
		onSubNavItemClick: () => undefined,
		onNavItemToggle: () => undefined,
		logo: <strong>Onora</strong>,
		logoDescription: <span className="text-xs text-muted">Admin Console</span>,
		footer: <span className="text-xs text-muted">v1.0</span>,
		getItemDescription: (item: { id: string }) => `${item.id} 메뉴 설명`,
	},
} satisfies Meta<typeof SidePanel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Comfortable: Story = {
	render: (args) => (
		<div className="h-screen w-72 border-r border-border">
			<SidePanel {...args} />
		</div>
	),
};
export const Compact: Story = {
	args: { density: "compact", descriptionVisibility: "active" },
	render: Comfortable.render,
};
