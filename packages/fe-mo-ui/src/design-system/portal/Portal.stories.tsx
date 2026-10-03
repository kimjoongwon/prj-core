import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Typography } from "../../data-display/Typography";
import { Portal } from "./Portal";
import { PortalHost } from "./PortalHost";

const meta = {
	title: "design-system/portal",
	component: Portal,
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof Portal>;

export default meta;

type Story = StoryObj;

const hostName = "storybook-notification-host";

export const PortalHostUsage: Story = {
	render: () => (
		<View className="w-[320px] gap-4 rounded-xl border border-border bg-surface p-4">
			<View className="min-h-[96px] justify-end rounded-xl border border-dashed border-border bg-background p-3">
				<PortalHost name={hostName} />
				<Typography color="muted" type="body-sm">이 영역 위쪽에 PortalHost가 배치됩니다.</Typography>
			</View>
			<Portal hostName={hostName} name="storybook-notification">
				<View className="rounded-xl bg-accent px-4 py-3">
					<Typography className="text-accent-foreground" type="body-sm" weight="semibold">
						Portal을 통해 렌더된 알림
					</Typography>
				</View>
			</Portal>
		</View>
	),
};
