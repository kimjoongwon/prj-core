import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Text } from "../../data-display/Text";
import { VStack } from "../VStack";
import { HStack } from "./index";

const meta = {
	title: "rhythm/HStack",
	component: HStack,
	args: {
		alignItems: "center",
		fullWidth: true,
		justifyContent: "between",
	},
	argTypes: {
		alignItems: {
			control: "select",
			options: ["start", "center", "end", "stretch", "baseline"],
		},
		justifyContent: {
			control: "select",
			options: ["start", "center", "end", "between", "around", "evenly"],
		},
		gap: {
			control: "select",
			options: [
				"flush",
				"dense",
				"inline",
				"block",
				"section",
				"page",
				"roomy",
			],
			description:
				"가로 간격 (flush=0, dense=4, inline=8, block=12, section=16, page=24, roomy=32px)",
		},
	},
	parameters: {
		layout: "centered",
	},
	render: (args) => (
		<HStack
			{...args}
			className="w-[280px] rounded-xl bg-surface-secondary p-4"
		>
			<View>
				<Text className="text-base font-bold text-foreground">내 예약</Text>
				<Text className="text-xs text-muted">오늘 확인할 항목</Text>
			</View>
			<View className="rounded-full bg-accent px-3 py-1">
				<Text className="text-xs font-bold text-accent-foreground">3건</Text>
			</View>
		</HStack>
	),
} satisfies Meta<typeof HStack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const GapScale: Story = {
	render: () => (
		<VStack gap="page" className="w-[280px]">
			{(
				[
					["flush", "flush — 붙어야 하는 조합 (0px)"],
					["dense", "dense — metadata·보조 label 묶음 (4px)"],
					["inline", "inline — 버튼 행·chip (8px)"],
					["block", "block — 제목-본문 짧은 묶음 (12px)"],
					["section", "section — 섹션 내부 기본 흐름 (16px)"],
					["page", "page — 페이지 주요 블록 사이 (24px)"],
					["roomy", "roomy — empty·auth·intro 여유 (32px)"],
				] as const
			).map(([gap, label]) => (
				<View key={gap}>
					<Text className="mb-2 text-sm font-bold text-foreground">{label}</Text>
					<HStack
						gap={gap}
						className="rounded-xl bg-surface-secondary p-3"
					>
						<Text className="text-sm text-foreground">항목 A</Text>
						<Text className="text-sm text-foreground">항목 B</Text>
					</HStack>
				</View>
			))}
		</VStack>
	),
};
