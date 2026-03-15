import type { Meta, StoryObj } from "@storybook/react";

const Placeholder = () => (
	<div style={{ padding: 16, fontFamily: "sans-serif" }}>
		<h3 style={{ margin: 0 }}>Story Placeholder</h3>
		<p style={{ marginTop: 8 }}>
			Component target: feature/idp/IdpLogin/IdpLogin.tsx
		</p>
		<p style={{ marginTop: 8 }}>Baseline story generated for coverage.</p>
	</div>
);

const meta: Meta<typeof Placeholder> = {
	title: "Features/idp/IdpLogin",
	component: Placeholder,
	parameters: {
		layout: "padded",
	},
	tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
