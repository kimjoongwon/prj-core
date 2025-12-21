import type { Meta, StoryObj } from "@storybook/react";
import { DogWalkRequestPage } from "./DogWalkRequestPage";

const meta = {
	title: "Page/DogWalkRequestPage",
	component: DogWalkRequestPage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof DogWalkRequestPage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {},
};

export const WithCustomClass: Story = {
	args: {
		className: "p-4 bg-gray-50",
	},
};
