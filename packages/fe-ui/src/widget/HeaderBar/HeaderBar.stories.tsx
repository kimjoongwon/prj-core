import type { Meta, StoryObj } from "@storybook/react";
import { Bell } from "lucide-react";
import { Button } from "../../input/Button/Button";
import { HeaderBar } from "./HeaderBar";

const meta = {
	title: "widget/HeaderBar",
	component: HeaderBar,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
	args: {
		userInfo: { name: "김온유", email: "onyu@example.com", role: "운영자" },
		logo: <strong>Onora</strong>,
		context: <span className="text-sm text-muted">강남 스페이스</span>,
		actions: (
			<Button isIconOnly variant="light" aria-label="알림">
				<Bell className="h-4 w-4" />
			</Button>
		),
		onLogout: () => undefined,
	},
} satisfies Meta<typeof HeaderBar>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Anonymous: Story = { args: { userInfo: undefined } };
