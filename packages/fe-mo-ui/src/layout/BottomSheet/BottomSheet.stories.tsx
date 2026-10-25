import type { Meta, StoryObj } from "@storybook/react-native";
import { makeAutoObservable } from "mobx";
import { observer, useLocalObservable } from "mobx-react-lite";
import { View } from "react-native";
import { Typography } from "../../data-display/Typography";
import { Button } from "../../input/Button";
import { BottomSheet } from "./index";
import { useStorybookState } from "../../storybook";

function createBottomSheetStoryState() {
	return makeAutoObservable(
		{ isOpen: false, setOpen(isOpen: boolean) { this.isOpen = isOpen; } },
		{},
		{ autoBind: true, name: "BottomSheetStoryState" },
	);
}

const meta = {
	title: "layout/BottomSheet",
	component: BottomSheet,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof BottomSheet>;

export default meta;

type Story = StoryObj;

export const Open: Story = {
	render: () => <BottomSheetStory />,
};

const BottomSheetStory = observer(function BottomSheetStory() {
		const state = useLocalObservable(createBottomSheetStoryState);
		useStorybookState(() => ({ isOpen: state.isOpen }));
		return (
		<View className="flex-1 justify-end px-4 py-5">
			<View className="gap-2 rounded-lg border border-border bg-surface p-4">
				<Typography className="font-extrabold" type="h5">
					BottomSheet
				</Typography>
				<Typography color="muted" type="body-sm">
					모바일에서 선택, 필터, 확인 작업을 화면 아래에서 띄웁니다.
				</Typography>
				<Button onPress={() => state.setOpen(true)} variant="secondary">시트 열기</Button>
			</View>
			<BottomSheet isOpen={state.isOpen} onOpenChange={state.setOpen}>
				<BottomSheet.Portal>
					<BottomSheet.Overlay className="bg-backdrop" />
					<BottomSheet.Content
						className="gap-4 rounded-t-2xl bg-background px-4 pb-6 pt-4"
						snapPoints={["42%"]}
					>
						<View className="flex-row items-start justify-between gap-3">
							<View className="flex-1 gap-1">
								<BottomSheet.Title className="text-lg font-bold text-foreground">
									예약 옵션
								</BottomSheet.Title>
								<BottomSheet.Description className="text-sm leading-5 text-muted">
									예약 시간과 요청 사항을 확인해 주세요.
								</BottomSheet.Description>
							</View>
							<BottomSheet.Close accessibilityLabel="예약 옵션 닫기" />
						</View>
						<Button variant="primary">선택 완료</Button>
					</BottomSheet.Content>
				</BottomSheet.Portal>
			</BottomSheet>
		</View>
		);
});
