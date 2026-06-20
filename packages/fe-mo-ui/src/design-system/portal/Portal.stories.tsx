import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Text } from "../../data-display/Text";
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
				<Text tone="muted">이 영역 위쪽에 PortalHost가 배치됩니다.</Text>
			</View>
			<Portal hostName={hostName} name="storybook-notification">
				<View className="rounded-xl bg-accent px-4 py-3">
					<Text className="text-accent-foreground" variant="label">
						Portal을 통해 렌더된 알림
					</Text>
				</View>
			</Portal>
		</View>
	),
};
