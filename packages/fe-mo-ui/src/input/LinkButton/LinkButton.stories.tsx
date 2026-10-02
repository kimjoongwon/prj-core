import type { Meta, StoryObj } from "@storybook/react-native";
import { ScrollView, View } from "react-native";
import { Text } from "../../data-display/Text";
import { HStack, VStack } from "../../rhythm";
import { LinkButton } from "./index";

const meta = {
	title: "input/LinkButton",
	component: LinkButton,
	args: {
		children: "이용 약관 보기",
		size: "md",
	},
	argTypes: {
		size: {
			control: "select",
			options: ["sm", "md", "lg"],
		},
	},
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof LinkButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InlineLinks: Story = {
	render: () => (
		<ScrollView contentContainerClassName="px-4 py-5">
			<VStack gap="section">
				<VStack gap="block">
					<Text className="text-lg font-extrabold text-foreground">
						LinkButton
					</Text>
					<Text className="text-sm leading-5 text-muted">
						본문 안에서 약관, 정책, 상세 보기 같은 낮은 강도의 액션을 표시합니다.
					</Text>
				</VStack>
				<View className="rounded-lg border border-border bg-surface p-4">
					<Text className="text-sm leading-6 text-surface-foreground">
						예약을 진행하면 환불 정책과 개인정보 처리방침에 동의한 것으로
						간주됩니다.
					</Text>
					<HStack
						alignItems="center"
						className="mt-3 flex-wrap"
						gap="block"
					>
						<LinkButton size="sm">환불 정책</LinkButton>
						<LinkButton size="sm">개인정보 처리방침</LinkButton>
						<LinkButton isDisabled size="sm">
							비활성 링크
						</LinkButton>
					</HStack>
				</View>
			</VStack>
		</ScrollView>
	),
};
