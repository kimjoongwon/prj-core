import type { Meta, StoryObj } from "@storybook/react";
import { ByteCounter } from "./ByteCounter";

const meta = {
	title: "widget/ByteCounter",
	component: ByteCounter,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { text: "예약 안내 문자가 발송됩니다." },
} satisfies Meta<typeof ByteCounter>;

export default meta;
type Story = StoryObj<typeof meta>;
export const ShortText: Story = {};
export const LongText: Story = {
	args: {
		text: "예약 안내와 변경 정책, 취소 수수료, 방문 전 준비사항을 모두 포함한 긴 메시지입니다. 문자 길이가 길어지면 여러 장으로 나뉠 수 있습니다.",
	},
};
