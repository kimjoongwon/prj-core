import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Text } from "../../data-display/Text";
import { VStack } from "./index";

const meta = {
	title: "rhythm/VStack",
	component: VStack,
	args: {
		alignItems: "stretch",
		fullWidth: true,
		justifyContent: "start",
	},
	argTypes: {
		alignItems: {
			control: "select",
			options: ["start", "center", "end", "stretch", "baseline"],
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
				"세로 간격 (flush=0, dense=4, inline=8, block=12, section=16, page=24, roomy=32px)",
		},
		justifyContent: {
			control: "select",
			options: ["start", "center", "end", "between", "around", "evenly"],
		},
	},
	parameters: {
		layout: "centered",
	},
	render: (args) => (
		<VStack {...args} className="w-[260px]">
			<View className="rounded-xl bg-surface-secondary p-4">
				<Text className="text-base font-bold text-foreground">예약 상태</Text>
			</View>
			<View className="rounded-xl bg-surface-secondary p-4">
				<Text className="text-sm text-muted">다음 행동을 안내합니다.</Text>
			</View>
			<View className="rounded-xl bg-surface-secondary p-4">
				<Text className="text-sm text-muted">필요한 정보만 묶습니다.</Text>
			</View>
		</VStack>
	),
} satisfies Meta<typeof VStack>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

const gapSamples = [
	["flush", "flush — 붙어야 하는 조합 (0px)"],
	["dense", "dense — metadata·보조 label 묶음 (4px)"],
	["inline", "inline — 버튼 행·chip (8px)"],
	["block", "block — 제목-본문 짧은 묶음 (12px)"],
	["section", "section — 섹션 내부 기본 흐름 (16px)"],
	["page", "page — 페이지 주요 블록 사이 (24px)"],
	["roomy", "roomy — empty·auth·intro 여유 (32px)"],
] as const;

export const GapScale: Story = {
	render: () => (
		<VStack gap="page" className="w-[280px]">
			{gapSamples.map(([gap, label]) => (
				<View key={gap}>
					<Text className="mb-2 text-sm font-bold text-foreground">{label}</Text>
					<VStack gap={gap} className="rounded-xl bg-surface-secondary p-3">
						<Text className="text-sm text-foreground">항목 A</Text>
						<Text className="text-sm text-foreground">항목 B</Text>
					</VStack>
				</View>
			))}
		</VStack>
	),
};
