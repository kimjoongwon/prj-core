import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Typography } from "../../data-display/Typography";
import { Menu } from "../Menu";
import { SubMenu } from "./index";

const meta = {
	title: "layout/SubMenu",
	component: SubMenu,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof SubMenu>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-4 px-4 py-5">
			<View className="gap-2">
				<Typography className="font-extrabold" type="h5">SubMenu</Typography>
				<Typography color="muted" type="body-sm">
					메뉴 안에서 관련된 하위 옵션을 접었다 펼칩니다.
				</Typography>
			</View>
			<Menu>
				<View className="rounded-lg border border-border bg-surface p-1">
					<Menu.Group>
						<SubMenu isDefaultOpen>
							<SubMenu.Trigger className="flex-row items-center justify-between">
								<Menu.ItemTitle>수업 필터</Menu.ItemTitle>
								<SubMenu.TriggerIndicator />
							</SubMenu.Trigger>
							<SubMenu.Content>
								<Menu.Item id="available">
									<Menu.ItemTitle>예약 가능</Menu.ItemTitle>
								</Menu.Item>
								<Menu.Item id="waitlist">
									<Menu.ItemTitle>대기 가능</Menu.ItemTitle>
								</Menu.Item>
							</SubMenu.Content>
						</SubMenu>
						<Menu.Item id="reset">
							<Menu.ItemTitle>필터 초기화</Menu.ItemTitle>
						</Menu.Item>
					</Menu.Group>
				</View>
			</Menu>
		</ScrollView>
	),
};
