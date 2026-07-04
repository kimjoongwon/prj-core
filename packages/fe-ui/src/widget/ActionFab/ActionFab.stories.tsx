import type { Meta, StoryObj } from "@storybook/react";
import { ActionFab } from "./ActionFab";

const actions = [
	{
		id: "create",
		subject: "reservation",
		label: "새 예약",
		icon: "CalendarDays",
	},
	{ id: "upload", subject: "asset", label: "에셋 업로드", icon: "Images" },
	{ id: "invite", subject: "user", label: "사용자 초대", icon: "Users" },
] as const;

const meta = {
	title: "widget/ActionFab",
	component: ActionFab,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
	args: {
		isOpen: true,
		actions: [...actions],
		onToggle: () => undefined,
		onActionClick: () => undefined,
	},
} satisfies Meta<typeof ActionFab>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Open: Story = {
	render: (args) => (
		<div className="min-h-[420px]">
			<ActionFab {...args} />
		</div>
	),
};
export const Closed: Story = { args: { isOpen: false }, render: Open.render };
