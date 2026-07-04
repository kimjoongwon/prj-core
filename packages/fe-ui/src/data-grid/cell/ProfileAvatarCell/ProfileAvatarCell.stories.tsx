import type { Meta, StoryObj } from "@storybook/react";
import { UserRound } from "lucide-react";
import { ProfileAvatarCell } from "./ProfileAvatarCell";

const meta = {
	title: "data-grid/cell/ProfileAvatarCell",
	component: ProfileAvatarCell,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { name: "김온유", subtitle: "onyu@example.com" },
} satisfies Meta<typeof ProfileAvatarCell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const IconFallback: Story = {
	args: {
		name: "운영자",
		subtitle: "관리자",
		icon: <UserRound className="h-4 w-4" />,
	},
};
export const Empty: Story = { args: { name: null, subtitle: null } };
