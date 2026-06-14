import type { Meta, StoryObj } from "@storybook/react";
import { AbilityFormScreen } from "./AbilityFormScreen";

const defaultArgs = {
	description: "스토리북에서 확인할 description 예시입니다.",
	mode: "create",
	status: "loading",
	title: "샘플 title",
};

const meta = {
	component: AbilityFormScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof AbilityFormScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
