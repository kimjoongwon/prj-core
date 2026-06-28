import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
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
				<Text className="text-lg font-extrabold text-foreground">Surface</Text>
				<Text className="text-sm leading-5 text-muted">
					화면 배경 위에 놓이는 기본 정보 그룹입니다.
				</Text>
			</View>
			<Surface className="gap-3 rounded-2xl p-4">
				<Text className="text-base font-extrabold text-foreground">
					Surface
				</Text>
				<Text className="text-sm leading-5 text-muted">
					className 기반 spacing과 border를 스토리북에서도 그대로 확인합니다.
				</Text>
			</Surface>
			<View className="gap-3">
				<Surface className="gap-1 rounded-2xl p-4" variant="default">
					<Text className="text-sm font-bold text-foreground">Default</Text>
					<Text className="text-xs leading-5 text-muted">
						가장 바깥쪽 카드에 쓰는 밝은 표면입니다.
					</Text>
				</Surface>
				<Surface className="gap-1 rounded-2xl p-4" variant="secondary">
					<Text className="text-sm font-bold text-foreground">Secondary</Text>
					<Text className="text-xs leading-5 text-muted">
						Surface의 기본값이며 local panel에 맞춘 표면입니다.
					</Text>
				</Surface>
				<Surface className="gap-1 rounded-2xl p-4" variant="tertiary">
					<Text className="text-sm font-bold text-foreground">Tertiary</Text>
					<Text className="text-xs leading-5 text-muted">
						중첩된 보조 정보 영역에 쓰는 더 낮은 표면입니다.
					</Text>
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
					<Text className="text-base font-extrabold text-foreground">
						ScreenSurface
					</Text>
					<Text className="text-sm leading-5 text-muted">
						화면 본문을 감싸는 가장 바깥 표면입니다.
					</Text>
				</View>
				<SectionSurface className="gap-3 rounded-2xl p-4">
					<Text className="text-sm font-bold text-foreground">
						SectionSurface
					</Text>
					<View className="gap-2 rounded-lg border border-border bg-white p-3 dark:border-white/10 dark:bg-neutral-600">
						<Text className="text-xs font-bold uppercase text-muted">
							Local content
						</Text>
						<Text className="text-sm leading-5 text-foreground">
							중첩된 내용 영역도 검게 가라앉지 않도록 밝은 neutral 단계로
							보여줍니다.
						</Text>
					</View>
				</SectionSurface>
			</ScreenSurface>
		</ScrollView>
	),
};
