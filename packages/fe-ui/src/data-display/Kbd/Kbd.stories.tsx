import type { Meta, StoryObj } from "@storybook/react";
import { Kbd } from "./Kbd";

const meta = {
	title: "Ui/data-display/Kbd",
	component: Kbd,
	tags: ["autodocs"],
} satisfies Meta<typeof Kbd>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: "⌘",
	},
};

export const Variants: Story = {
	args: {
		children: "Esc",
		variant: "light",
	},
};

export const Composition: Story = {
	args: {
		children: "⌘ + S",
	},
	render: () => (
		<div className="flex items-center gap-2">
			<Kbd>
				<Kbd.Abbr keyValue="command" />
				<Kbd.Content> + </Kbd.Content>
				<Kbd.Content>S</Kbd.Content>
			</Kbd>
		</div>
	),
};
