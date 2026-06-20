import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Text } from "../../data-display/Text";
import { ScreenActionBar } from "../ScreenActionBar";
import { ScreenFrame } from "./index";

const meta = {
	title: "layout/ScreenFrame",
	component: ScreenFrame,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof ScreenFrame>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScreenFrame
			backgroundColor="#09090b"
			contentClassName="justify-center px-4"
			edges={["top", "right", "bottom", "left"]}
		>
			<View className="gap-2 rounded-lg border border-border bg-surface p-4">
				<Text className="text-lg font-extrabold text-foreground">
					ScreenFrame
				</Text>
				<Text className="text-sm leading-5 text-muted">
					안전 영역과 화면 배경을 하나의 native screen frame으로 관리합니다.
				</Text>
			</View>
		</ScreenFrame>
	),
};

export const WithBottomAction: Story = {
	render: () => (
		<ScreenFrame
			backgroundColor="#09090b"
			bottom={
				<ScreenActionBar
					description="예약 전 선택 내용을 한 번 더 확인해 주세요."
					onPressPrimaryAction={() => undefined}
					onPressSecondaryAction={() => undefined}
					primaryActionLabel="예약 계속하기"
					secondaryActionLabel="다시 선택"
				/>
			}
			contentClassName="justify-center px-4"
			edges={["top", "right", "bottom", "left"]}
		>
			<View className="gap-2 rounded-lg border border-border bg-surface p-4">
				<Text className="text-lg font-extrabold text-foreground">
					하단 액션 슬롯
				</Text>
				<Text className="text-sm leading-5 text-muted">
					safe area padding은 ScreenFrame이 소유하고, CTA 묶음은
					ScreenActionBar가 담당합니다.
				</Text>
			</View>
		</ScreenFrame>
	),
};
