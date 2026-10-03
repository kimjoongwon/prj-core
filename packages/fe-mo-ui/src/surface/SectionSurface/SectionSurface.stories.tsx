import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Typography } from "../../data-display/Typography";
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
					<Typography className="font-extrabold" type="h5">
						SectionSurface
					</Typography>
					<Typography color="muted" type="body-sm">
						화면 안의 주요 구획을 감싸는 section-level 표면입니다.
					</Typography>
				</View>
				<Surface className="gap-1 rounded-xl p-3" variant="tertiary">
					<Typography type="body-sm" weight="bold">다음 예약</Typography>
					<Typography color="muted" type="body-sm">
						오전 10:30, 강남 리포머 센터
					</Typography>
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
					<Typography type="body-sm" weight="bold">{variant}</Typography>
					<Typography color="muted" type="body-sm">
						section 표면의 variant 단계와 내부 텍스트 대비를 확인합니다.
					</Typography>
				</SectionSurface>
			))}
		</ScrollView>
	),
};
