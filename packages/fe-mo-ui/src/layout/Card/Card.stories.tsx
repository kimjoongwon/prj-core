import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Typography } from "../../data-display/Typography";
import { Button } from "../../input/Button";
import { Separator } from "../Separator";
import { Card } from "./index";

const meta = {
	title: "layout/Card",
	component: Card,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-3 px-4 py-5">
			<View className="gap-2">
				<Typography className="font-extrabold" type="h5">Card</Typography>
				<Typography color="muted" type="body-sm">
					반복 목록, 예약 요약, 상태 패널처럼 독립적인 묶음에 사용합니다.
				</Typography>
			</View>
			<Card className="gap-3 border border-border">
				<Card.Title>Card title</Card.Title>
				<Card.Description>
					화면의 독립적인 정보 그룹과 액션을 묶습니다.
				</Card.Description>
				<Separator />
				<View className="flex-row flex-wrap gap-2">
					<Button size="sm" variant="secondary">
						보조
					</Button>
					<Button size="sm" variant="primary">
						주요
					</Button>
				</View>
			</Card>
		</ScrollView>
	),
};
