import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Typography } from "../../data-display/Typography";
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
					<Typography className="font-extrabold" type="h5">
						ScreenSurface
					</Typography>
					<Typography color="muted" type="body-sm">
						모바일 화면 본문이 소유하는 가장 바깥 표면입니다.
					</Typography>
				</View>
				<SectionSurface className="gap-2 rounded-xl p-3">
					<Typography type="body-sm" weight="bold">예약 요약</Typography>
					<Typography color="muted" type="body-sm">
						오늘의 예약과 다음 액션을 screen 표면 안에서 구분합니다.
					</Typography>
				</SectionSurface>
			</ScreenSurface>
		</ScrollView>
	),
};

export const LongContent: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 bg-background px-4 py-5">
			<ScreenSurface className="gap-3 rounded-2xl p-4">
				<Typography className="font-extrabold" type="h5">
					긴 본문 화면
				</Typography>
				{["예약 정책", "취소 규정", "방문 안내"].map((title) => (
					<SectionSurface className="gap-1 rounded-xl p-3" key={title}>
						<Typography type="body-sm" weight="bold">{title}</Typography>
						<Typography color="muted" type="body-sm">
							긴 설명과 여러 구획이 이어질 때 screen-level surface의 간격과 배경
							단계를 확인합니다.
						</Typography>
					</SectionSurface>
				))}
			</ScreenSurface>
		</ScrollView>
	),
};
