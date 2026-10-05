import type { Meta, StoryObj } from "@storybook/react";
import { Plus } from "lucide-react";
import { Button } from "../../input/Button/Button";
import { EmptyState } from "./EmptyState";

const meta = {
	title: "feedback/EmptyState",
	component: EmptyState,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: {
		title: "데이터가 없습니다",
		description: "새 항목을 추가하면 이 영역에 표시됩니다.",
		statusLabel: "Empty",
	},
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithAction: Story = {
	args: {
		action: <Button startContent={<Plus className="h-4 w-4" />}>추가</Button>,
	},
};
