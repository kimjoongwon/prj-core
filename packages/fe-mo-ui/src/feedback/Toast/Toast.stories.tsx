import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { Button } from "../../input/Button";
import { Toast, useToast } from "./index";

const ToastDemo = () => {
	const { toast } = useToast();

	const onPressShowToast = () => {
		toast.show({
			actionLabel: "확인",
			description: "예약 내역에서 상세 정보를 확인할 수 있습니다.",
			duration: "persistent",
			label: "예약이 완료되었습니다",
			placement: "top",
			variant: "success",
		});
	};

	return (
		<ScrollView contentContainerClassName="gap-4 px-4 py-5">
			<View className="gap-2">
				<Text className="text-lg font-extrabold text-foreground">Toast</Text>
				<Text className="text-sm leading-5 text-muted">
					작업 결과를 화면 위쪽이나 아래쪽에 잠깐 표시합니다.
				</Text>
			</View>
			<View className="gap-3 rounded-lg border border-border bg-surface p-4">
				<Text className="text-sm leading-5 text-surface-foreground">
					버튼을 누르면 Storybook preview provider의 toast runtime으로 알림을
					띄웁니다.
				</Text>
				<Button onPress={onPressShowToast} variant="primary">
					Toast 표시
				</Button>
			</View>
		</ScrollView>
	);
};

const meta = {
	title: "feedback/Toast",
	component: Toast,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => <ToastDemo />,
};
