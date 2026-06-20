import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Text } from "../../data-display/Text";
import { ScreenActionBar } from "./index";

const meta = {
	title: "layout/ScreenActionBar",
	component: ScreenActionBar,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof ScreenActionBar>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<View className="flex-1 justify-end bg-background">
			<ScreenActionBar
				description="선택한 일정과 결제 정보를 확인한 뒤 다음 단계로 이동합니다."
				onPressPrimaryAction={() => undefined}
				onPressSecondaryAction={() => undefined}
				primaryActionLabel="예약 계속하기"
				secondaryActionLabel="다시 선택"
			/>
		</View>
	),
};

export const Horizontal: Story = {
	render: () => (
		<View className="flex-1 justify-end bg-background">
			<ScreenActionBar
				description="짧은 확인 화면에서는 두 액션을 한 줄로 배치할 수 있습니다."
				onPressPrimaryAction={() => undefined}
				onPressSecondaryAction={() => undefined}
				orientation="horizontal"
				primaryActionLabel="확인"
				secondaryActionLabel="취소"
			/>
		</View>
	),
};

export const CustomContent: Story = {
	render: () => (
		<View className="flex-1 justify-end bg-background">
			<ScreenActionBar description="필요하면 직접 조합한 액션 영역도 사용할 수 있습니다.">
				<View className="rounded-lg border border-border bg-surface-secondary p-3">
					<Text className="text-center text-sm font-bold text-foreground">
						커스텀 하단 액션
					</Text>
				</View>
			</ScreenActionBar>
		</View>
	),
};
