import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Typography } from "../../data-display/Typography";
import { ScreenSurface } from "../ScreenSurface";
import { SectionSurface } from "../SectionSurface";
import { Surface } from "./index";

const meta = {
	title: "surface/Surface",
	component: Surface,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Surface>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 bg-background px-4 py-5">
			<View className="gap-2">
				<Typography className="font-extrabold" type="h5">Surface</Typography>
				<Typography color="muted" type="body-sm">
					화면 배경 위에 놓이는 기본 정보 그룹입니다.
				</Typography>
			</View>
			<Surface className="gap-3 rounded-2xl p-4">
				<Typography className="font-extrabold" type="h6">
					Surface
				</Typography>
				<Typography color="muted" type="body-sm">
					className 기반 spacing과 border를 스토리북에서도 그대로 확인합니다.
				</Typography>
			</Surface>
			<View className="gap-3">
				<Surface className="gap-1 rounded-2xl p-4" variant="default">
					<Typography type="body-sm" weight="bold">Default</Typography>
					<Typography color="muted" type="body-xs">
						가장 바깥쪽 카드에 쓰는 기본 표면 단계입니다.
					</Typography>
				</Surface>
				<Surface className="gap-1 rounded-2xl p-4" variant="secondary">
					<Typography type="body-sm" weight="bold">Secondary</Typography>
					<Typography color="muted" type="body-xs">
						Surface의 기본값이며 local panel에 맞춘 표면입니다.
					</Typography>
				</Surface>
				<Surface className="gap-1 rounded-2xl p-4" variant="tertiary">
					<Typography type="body-sm" weight="bold">Tertiary</Typography>
					<Typography color="muted" type="body-xs">
						중첩된 보조 정보 영역에 쓰는 더 낮은 표면입니다.
					</Typography>
				</Surface>
			</View>
		</ScrollView>
	),
};

export const Hierarchy: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 bg-background px-4 py-5">
			<ScreenSurface className="gap-4 rounded-2xl p-4">
				<View className="gap-1">
					<Typography className="font-extrabold" type="h6">
						ScreenSurface
					</Typography>
					<Typography color="muted" type="body-sm">
						화면 본문을 감싸는 가장 바깥 표면입니다.
					</Typography>
				</View>
				<SectionSurface className="gap-3 rounded-2xl p-4">
					<Typography type="body-sm" weight="bold">
						SectionSurface
					</Typography>
					<Surface className="gap-2 rounded-lg p-3" variant="tertiary">
						<Typography className="uppercase" color="muted" type="body-xs" weight="bold">
							Local content
						</Typography>
						<Typography type="body-sm">
							중첩된 내용 영역은 tertiary 표면 단계로 구분합니다.
						</Typography>
					</Surface>
				</SectionSurface>
			</ScreenSurface>
		</ScrollView>
	),
};
