import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { SectionSurface } from "../SectionSurface";
import { ScreenSurface } from "./index";

const meta = {
	title: "surface/ScreenSurface",
	component: ScreenSurface,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof ScreenSurface>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-4 bg-background px-4 py-5">
			<ScreenSurface className="gap-4 rounded-2xl p-4">
				<View className="gap-1">
					<Text className="text-lg font-extrabold text-foreground">
						ScreenSurface
					</Text>
					<Text className="text-sm leading-5 text-muted">
						모바일 화면 본문이 소유하는 가장 바깥 표면입니다.
					</Text>
				</View>
				<SectionSurface className="gap-2 rounded-xl p-3">
					<Text className="text-sm font-bold text-foreground">예약 요약</Text>
					<Text className="text-sm leading-5 text-muted">
						오늘의 예약과 다음 액션을 screen 표면 안에서 구분합니다.
					</Text>
				</SectionSurface>
			</ScreenSurface>
		</ScrollView>
	),
};

export const LongContent: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 bg-background px-4 py-5">
			<ScreenSurface className="gap-3 rounded-2xl p-4">
				<Text className="text-lg font-extrabold text-foreground">
					긴 본문 화면
				</Text>
				{["예약 정책", "취소 규정", "방문 안내"].map((title) => (
					<SectionSurface className="gap-1 rounded-xl p-3" key={title}>
						<Text className="text-sm font-bold text-foreground">{title}</Text>
						<Text className="text-sm leading-5 text-muted">
							긴 설명과 여러 구획이 이어질 때 screen-level surface의 간격과 배경
							단계를 확인합니다.
						</Text>
					</SectionSurface>
				))}
			</ScreenSurface>
		</ScrollView>
	),
};
