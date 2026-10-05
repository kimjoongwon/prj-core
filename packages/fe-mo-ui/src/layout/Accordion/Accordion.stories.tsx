import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Typography } from "../../data-display/Typography";
import { Accordion } from "./index";

const meta = {
	title: "layout/Accordion",
	component: Accordion,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Accordion>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<ScrollView contentContainerClassName="gap-4 px-4 py-5">
			<View className="gap-2">
				<Typography className="font-extrabold" type="h5">
					Accordion
				</Typography>
				<Typography color="muted" type="body-sm">
					정책, 안내, FAQ처럼 접었다 펼치는 정보를 보여줍니다.
				</Typography>
			</View>
			<Accordion defaultValue="cancel" variant="surface">
				<Accordion.Item value="cancel">
					<Accordion.Trigger className="flex-row items-center justify-between">
						<Typography type="body-sm" weight="bold">취소 정책</Typography>
						<Accordion.Indicator />
					</Accordion.Trigger>
					<Accordion.Content>
						<Typography className="px-4 pb-4" color="muted" type="body-sm">
							수업 시작 3시간 전까지 앱에서 직접 취소할 수 있습니다.
						</Typography>
					</Accordion.Content>
				</Accordion.Item>
				<Accordion.Item value="waitlist">
					<Accordion.Trigger className="flex-row items-center justify-between">
						<Typography type="body-sm" weight="bold">대기 예약</Typography>
						<Accordion.Indicator />
					</Accordion.Trigger>
					<Accordion.Content>
						<Typography className="px-4 pb-4" color="muted" type="body-sm">
							자리가 나면 알림을 받고 순서대로 예약이 확정됩니다.
						</Typography>
					</Accordion.Content>
				</Accordion.Item>
			</Accordion>
		</ScrollView>
	),
};
