import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Typography } from "../../data-display/Typography";
import { Icon } from "../../icon";
import { ListGroup } from "./index";

const meta = {
	title: "layout/ListGroup",
	component: ListGroup,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof ListGroup>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-4 px-4 py-5">
			<View className="gap-2">
				<Typography className="font-extrabold" type="h5">
					ListGroup
				</Typography>
				<Typography color="muted" type="body-sm">
					설정, 계정, 예약 상세의 관련 행을 하나의 surface로 묶습니다.
				</Typography>
			</View>
			<ListGroup>
				<ListGroup.Item>
					<ListGroup.ItemPrefix>
						<Icon name="calendarDays" size="sm" tone="accent" />
					</ListGroup.ItemPrefix>
					<ListGroup.ItemContent>
						<ListGroup.ItemTitle>예약 일정</ListGroup.ItemTitle>
						<ListGroup.ItemDescription>
							5월 23일 토요일 09:30
						</ListGroup.ItemDescription>
					</ListGroup.ItemContent>
					<ListGroup.ItemSuffix />
				</ListGroup.Item>
				<ListGroup.Item>
					<ListGroup.ItemPrefix>
						<Icon name="mapPin" size="sm" tone="accent" />
					</ListGroup.ItemPrefix>
					<ListGroup.ItemContent>
						<ListGroup.ItemTitle>지점</ListGroup.ItemTitle>
						<ListGroup.ItemDescription>
							강남 리포머 센터
						</ListGroup.ItemDescription>
					</ListGroup.ItemContent>
					<ListGroup.ItemSuffix />
				</ListGroup.Item>
			</ListGroup>
		</ScrollView>
	),
};
