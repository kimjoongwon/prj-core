import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Typography } from "../../data-display/Typography";
import { Button } from "../../input/Button";
import { Popover } from "./index";

const meta = {
	title: "layout/Popover",
	component: Popover,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<View className="flex-1 justify-center px-4 py-5">
			<View className="gap-4 rounded-lg border border-border bg-surface p-4">
				<View className="gap-1">
					<Typography className="font-extrabold" type="h5">
						Popover
					</Typography>
					<Typography color="muted" type="body-sm">
						버튼 주변에 보조 설명과 작은 액션을 띄웁니다.
					</Typography>
				</View>
				<Popover isDefaultOpen>
					<Popover.Trigger>
						<Button variant="secondary">정책 보기</Button>
					</Popover.Trigger>
					<Popover.Portal>
						<Popover.Overlay className="bg-transparent" />
						<Popover.Content
							className="gap-2 rounded-lg border border-border bg-surface p-3"
							placement="top"
							presentation="popover"
							width={260}
						>
							<Popover.Arrow />
							<View className="flex-row items-start justify-between gap-3">
								<View className="flex-1 gap-1">
									<Popover.Title className="text-sm font-bold text-foreground">
										취소 가능 시간
									</Popover.Title>
									<Popover.Description className="text-xs leading-5 text-muted">
										수업 시작 3시간 전까지 취소할 수 있습니다.
									</Popover.Description>
								</View>
								<Popover.Close accessibilityLabel="팝오버 닫기" />
							</View>
						</Popover.Content>
					</Popover.Portal>
				</Popover>
			</View>
		</View>
	),
};
