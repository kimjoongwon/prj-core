import type { Meta, StoryObj } from "@storybook/react";
import { HStack, VStack } from "../../rhythm";
import { Separator } from "./Separator";

const meta = {
	title: "layout/Separator",
	component: Separator,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"관련 정보 사이에 낮은 강도의 구분선을 넣는 HeroUI Separator 재수출 래퍼입니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		orientation: {
			control: "select",
			options: ["horizontal", "vertical"],
			description: "구분선 방향",
		},
		variant: {
			control: "select",
			options: ["default", "secondary", "tertiary"],
			description: "구분선 강도",
		},
	},
	args: {
		orientation: "horizontal",
	},
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {};

export const 예시: Story = {
	render: () => (
		<VStack className="w-80 rounded-lg border border-border bg-surface p-4" gap="block">
			<HStack justifyContent="between">
				<span className="text-sm font-bold">예약 정보</span>
				<span className="text-muted text-sm">2026-05-23 09:30</span>
			</HStack>
			<Separator />
			<HStack gap="section">
				<span className="text-sm">Studio A</span>
				<Separator orientation="vertical" />
				<span className="text-sm">Hana coach</span>
			</HStack>
			<Separator variant="secondary" />
			<span className="text-muted text-sm">이력과 메모는 아래 구분으로 나눕니다.</span>
		</VStack>
	),
	parameters: {
		docs: {
			description: {
				story:
					"정보 묶음 사이는 기본 구분선, 강조 구분은 variant로 낮추어 표현합니다.",
			},
		},
	},
};
