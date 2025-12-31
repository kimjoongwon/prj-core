import type { Meta, StoryObj } from "@storybook/react";
import { CharacterCounter } from "./CharacterCounter";

const meta = {
	title: "UI/CharacterCounter",
	component: CharacterCounter,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof CharacterCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		current: 50,
		max: 100,
	},
};

export const Normal: Story = {
	args: {
		current: 30,
		max: 100,
	},
};

export const Warning: Story = {
	args: {
		current: 85,
		max: 100,
	},
};

export const Danger: Story = {
	args: {
		current: 105,
		max: 100,
	},
};

export const AllStates: Story = {
	render: () => (
		<div className="w-64 space-y-4">
			<div>
				<div className="text-sm mb-1">정상 (30/100)</div>
				<CharacterCounter current={30} max={100} />
			</div>
			<div>
				<div className="text-sm mb-1">경고 (85/100)</div>
				<CharacterCounter current={85} max={100} />
			</div>
			<div>
				<div className="text-sm mb-1">에러 (105/100)</div>
				<CharacterCounter current={105} max={100} />
			</div>
		</div>
	),
};
