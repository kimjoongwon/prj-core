import type { Meta, StoryObj } from "@storybook/react";
import { SpaceAlert } from "./SpaceAlert";

const meta = {
	title: "widget/SpaceAlert",
	component: SpaceAlert,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
	args: { onConfirm: () => undefined, onDismiss: () => undefined },
} satisfies Meta<typeof SpaceAlert>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
	render: (args) => (
		<div className="min-h-[420px]">
			<SpaceAlert {...args} />
		</div>
	),
};
