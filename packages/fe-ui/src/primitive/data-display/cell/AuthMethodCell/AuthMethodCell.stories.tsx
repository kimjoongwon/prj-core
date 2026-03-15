import type { Meta, StoryObj } from "@storybook/react";

const Placeholder = () => (
	<div style={{ padding: 16, fontFamily: "sans-serif" }}>
		<h3 style={{ margin: 0 }}>Story Placeholder</h3>
		<p style={{ marginTop: 8 }}>
			Component target: ui/data-display/cell/AuthMethodCell/AuthMethodCell.tsx
		</p>
		<p style={{ marginTop: 8 }}>Baseline story generated for coverage.</p>
	</div>
);

const meta: Meta<typeof Placeholder> = {
	title: "Ui/data-display/cell/AuthMethodCell",
	component: Placeholder,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
