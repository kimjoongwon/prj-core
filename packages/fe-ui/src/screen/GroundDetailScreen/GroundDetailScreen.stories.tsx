import type { Meta, StoryObj } from "@storybook/react";
import { GroundDetailScreen } from "./GroundDetailScreen";

const defaultArgs = {
	ground: {
		address: "address-1",
		email: "member1@example.com",
		label: "샘플 label 1",
		name: "샘플 시설 1",
		phone: "010-1234-5670",
	},
	isNotFound: false,
	onClickBackButton: (..._args: never[]) => undefined,
	onClickEditButton: (..._args: never[]) => undefined,
};

const notFoundArgs = {
	...defaultArgs,
	isNotFound: true,
};

const meta = {
	title: "screen/GroundDetailScreen",
	component: GroundDetailScreen,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	args: defaultArgs as never,
} satisfies Meta<typeof GroundDetailScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NotFound: Story = {
	args: notFoundArgs as never,
};
