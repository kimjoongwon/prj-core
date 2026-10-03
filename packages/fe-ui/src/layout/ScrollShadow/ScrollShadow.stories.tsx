import type { Meta, StoryObj } from "@storybook/react";
import { VStack } from "../../rhythm";
import { ScrollShadow } from "./ScrollShadow";

const menuItems = [
	"Morning Reformer",
	"Core Balance",
	"Evening Barre",
	"Tower Flow",
	"Stretch Recovery",
	"Private Session",
	"Equipment Check",
	"Instructor Meeting",
];

const meta = {
	title: "layout/ScrollShadow",
	component: ScrollShadow,
	parameters: {
		layout: "centered",
		docs: {
			description: {
				component:
					"스크롤 가능한 영역의 가장자리에 그라데이션 그림자를 더하는 HeroUI ScrollShadow 재수출 래퍼입니다.",
			},
		},
	},
	tags: ["autodocs"],
	argTypes: {
		orientation: {
			control: "select",
			options: ["vertical", "horizontal"],
			description: "스크롤 방향",
		},
		visibility: {
			control: "select",
			options: ["auto", "top", "bottom", "both", "none"],
			description: "그림자 표시 조건",
		},
		size: {
			control: "number",
			description: "그림자 크기 (px)",
		},
		hideScrollBar: {
			control: "boolean",
			description: "스크롤바 숨김 여부",
		},
	},
	args: {
		orientation: "vertical",
		visibility: "auto",
		size: 24,
	},
} satisfies Meta<typeof ScrollShadow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const 기본: Story = {
	render: (args) => (
		<ScrollShadow
			{...args}
			className="h-72 w-80 rounded-lg border border-border bg-surface"
		>
			<VStack className="p-4" gap="block">
				{menuItems.map((name) => (
					<div
						className="rounded-lg border border-border bg-surface-secondary p-3 text-sm"
						key={name}
					>
						{name}
					</div>
				))}
			</VStack>
		</ScrollShadow>
	),
	parameters: {
		docs: {
			description: {
				story: "세로 목록의 스크롤 위치에 따라 위아래 그림자가 나타납니다.",
			},
		},
	},
};
