import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Text } from "../../data-display/Text";
import { Button } from "../../input/Button";
import { Menu } from "./index";

const meta = {
	title: "layout/Menu",
	component: Menu,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<View className="flex-1 justify-center px-4 py-5">
			<View className="gap-4 rounded-lg border border-border bg-surface p-4">
				<View className="gap-1">
					<Text className="text-lg font-extrabold text-foreground">Menu</Text>
					<Text className="text-sm leading-5 text-muted">
						정렬, 필터, 행 액션처럼 짧은 명령 세트를 표시합니다.
					</Text>
				</View>
				<Menu isDefaultOpen>
					<Menu.Trigger>
						<Button variant="secondary">메뉴 열기</Button>
					</Menu.Trigger>
					<Menu.Portal>
						<Menu.Overlay className="bg-transparent" />
						<Menu.Content
							className="rounded-lg border border-border bg-surface p-1"
							placement="bottom"
							presentation="popover"
							width={260}
						>
							<Menu.Label className="px-3 py-2 text-xs font-bold uppercase text-muted">
								예약 보기
							</Menu.Label>
							<Menu.Group
								defaultSelectedKeys={["available"]}
								selectionMode="single"
							>
								<Menu.Item id="available">
									<Menu.ItemTitle>예약 가능만 보기</Menu.ItemTitle>
									<Menu.ItemIndicator />
								</Menu.Item>
								<Menu.Item id="mine">
									<Menu.ItemTitle>내 예약 보기</Menu.ItemTitle>
									<Menu.ItemIndicator />
								</Menu.Item>
								<Menu.Item id="cancel" variant="danger">
									<Menu.ItemTitle>예약 취소</Menu.ItemTitle>
								</Menu.Item>
							</Menu.Group>
						</Menu.Content>
					</Menu.Portal>
				</Menu>
			</View>
		</View>
	),
};
