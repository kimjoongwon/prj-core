import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Button } from "../../input/Button";
import { Text } from "../../data-display/Text";
import { Dialog } from "./index";

const meta = {
	title: "layout/Dialog",
	component: Dialog,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj;

export const Open: Story = {
	render: () => (
		<View className="flex-1 justify-center px-4 py-5">
			<View className="gap-2 rounded-lg border border-border bg-surface p-4">
				<Text className="text-lg font-extrabold text-foreground">Dialog</Text>
				<Text className="text-sm leading-5 text-muted">
					파괴적 작업이나 중요한 확인을 중앙 오버레이로 묻습니다.
				</Text>
			</View>
			<Dialog isOpen onOpenChange={() => undefined}>
				<Dialog.Portal>
					<Dialog.Overlay className="bg-foreground/25" />
					<Dialog.Content className="mx-5 gap-4 rounded-xl border border-border bg-surface p-4">
						<View className="flex-row items-start justify-between gap-3">
							<View className="flex-1 gap-1">
								<Dialog.Title className="text-lg font-bold text-foreground">
									예약을 취소할까요?
								</Dialog.Title>
								<Dialog.Description className="text-sm leading-5 text-muted">
									취소 후에는 다시 예약해야 하며, 마감된 수업은 복구할 수
									없습니다.
								</Dialog.Description>
							</View>
							<Dialog.Close accessibilityLabel="다이얼로그 닫기" />
						</View>
						<View className="flex-row gap-2">
							<Button className="flex-1" variant="secondary">
								유지
							</Button>
							<Button className="flex-1" variant="danger">
								취소
							</Button>
						</View>
					</Dialog.Content>
				</Dialog.Portal>
			</Dialog>
		</View>
	),
};
