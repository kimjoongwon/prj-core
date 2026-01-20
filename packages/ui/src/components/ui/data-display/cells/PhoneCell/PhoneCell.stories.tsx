import type { Meta, StoryObj } from "@storybook/react";
import { PhoneCell } from "./PhoneCell";

const meta: Meta<typeof PhoneCell> = {
	title: "ui/data-display/cells/PhoneCell",
	component: PhoneCell,
	tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PhoneCell>;

export const 휴대폰번호: Story = {
	args: {
		value: "01012345678",
	},
};

export const 서울지역번호: Story = {
	args: {
		value: "0212345678",
	},
};

export const 경기지역번호: Story = {
	args: {
		value: "0311234567",
	},
};

export const 이미포맷팅됨: Story = {
	args: {
		value: "010-1234-5678",
	},
};

export const 값없음: Story = {
	args: {
		value: null,
	},
};

export const 빈문자열: Story = {
	args: {
		value: "",
	},
};
