import type { Meta, StoryObj } from "@storybook/react-native";
import { View } from "react-native";
import { Text } from "../../data-display/Text";
import { Button } from "../../input/Button";
import { Card } from "../../layout/Card";
import { DesignSystemProvider } from "./index";

const meta = {
	title: "design-system/provider",
	component: DesignSystemProvider,
	parameters: {
		layout: "centered",
	},
} satisfies Meta<typeof DesignSystemProvider>;

export default meta;

type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<DesignSystemProvider
			config={{
				textProps: {
					allowFontScaling: true,
				},
			}}
		>
			<Card className="w-[280px] gap-3 border border-border">
				<Card.Title>DesignSystemProvider</Card.Title>
				<Card.Description>
					HeroUI Native 런타임 설정과 포털 호스트를 제공합니다.
				</Card.Description>
				<View className="flex-row items-center justify-between">
					<Text className="text-sm font-semibold text-muted">Portal ready</Text>
					<Button size="sm" variant="secondary">
						Check
					</Button>
				</View>
			</Card>
		</DesignSystemProvider>
	),
};
