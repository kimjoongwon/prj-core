import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { Surface } from "../Surface";
import { SectionSurface } from "./index";

const meta = {
	title: "surface/SectionSurface",
	component: SectionSurface,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof SectionSurface>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-4 bg-background px-4 py-5">
			<SectionSurface className="gap-3 rounded-2xl p-4">
				<View className="gap-1">
					<Text className="text-lg font-extrabold text-foreground">
						SectionSurface
					</Text>
					<Text className="text-sm leading-5 text-muted">
						화면 안의 주요 구획을 감싸는 section-level 표면입니다.
					</Text>
				</View>
				<Surface className="gap-1 rounded-xl p-3" variant="tertiary">
					<Text className="text-sm font-bold text-foreground">
						다음 예약
					</Text>
					<Text className="text-sm leading-5 text-muted">
						오전 10:30, 강남 리포머 센터
					</Text>
				</Surface>
			</SectionSurface>
		</ScrollView>
	),
};

export const Variants: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 bg-background px-4 py-5">
			{(["default", "secondary", "tertiary"] as const).map((variant) => (
				<SectionSurface
					className="gap-1 rounded-2xl p-4"
					key={variant}
					variant={variant}
				>
					<Text className="text-sm font-bold text-foreground">{variant}</Text>
					<Text className="text-sm leading-5 text-muted">
						section 표면의 variant 단계와 내부 텍스트 대비를 확인합니다.
					</Text>
				</SectionSurface>
			))}
		</ScrollView>
	),
};
