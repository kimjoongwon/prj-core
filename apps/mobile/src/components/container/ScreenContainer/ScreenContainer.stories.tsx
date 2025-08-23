import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { ScreenContainer } from "./ScreenContainer";

const meta: Meta<typeof ScreenContainer> = {
	title: "Container/ScreenContainer",
	component: ScreenContainer,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component:
					"스크린 전체를 감싸는 컨테이너 컴포넌트입니다. 다크/라이트 모드에 따라 배경색이 자동으로 설정되며, SafeAreaView와 StatusBar를 제어할 수 있습니다.",
			},
		},
	},
	argTypes: {
		safeArea: {
			control: { type: "boolean" },
			description: "SafeAreaView 사용 여부",
		},
		statusBarStyle: {
			control: { type: "select" },
			options: ["light-content", "dark-content", "auto"],
			description: "StatusBar 스타일",
		},
		backgroundColor: {
			control: { type: "color" },
			description: "커스텀 배경색 (선택사항)",
		},
	},
	args: {
		safeArea: true,
		statusBarStyle: "auto",
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

const DemoContent: React.FC = () => (
	<View style={demoStyles.content}>
		<Text variant="h2" style={demoStyles.title}>
			ScreenContainer 데모
		</Text>
		<Text variant="body1" style={demoStyles.description}>
			이 컨테이너는 테마에 따라 배경색이 자동으로 변경됩니다.
		</Text>
		<Button variant="solid" color="primary" style={demoStyles.button}>
			버튼 예제
		</Button>
	</View>
);

export const Default: Story = {
	render: (args) => (
		<ScreenContainer {...args}>
			<DemoContent />
		</ScreenContainer>
	),
};

export const WithoutSafeArea: Story = {
	args: {
		safeArea: false,
	},
	render: (args) => (
		<ScreenContainer {...args}>
			<DemoContent />
		</ScreenContainer>
	),
	parameters: {
		docs: {
			description: {
				story: "SafeArea를 사용하지 않는 버전입니다.",
			},
		},
	},
};

export const LightStatusBar: Story = {
	args: {
		statusBarStyle: "light-content",
	},
	render: (args) => (
		<ScreenContainer {...args}>
			<DemoContent />
		</ScreenContainer>
	),
	parameters: {
		docs: {
			description: {
				story: "StatusBar 스타일을 light-content로 고정합니다.",
			},
		},
	},
};

export const DarkStatusBar: Story = {
	args: {
		statusBarStyle: "dark-content",
	},
	render: (args) => (
		<ScreenContainer {...args}>
			<DemoContent />
		</ScreenContainer>
	),
	parameters: {
		docs: {
			description: {
				story: "StatusBar 스타일을 dark-content로 고정합니다.",
			},
		},
	},
};

export const CustomBackground: Story = {
	args: {
		backgroundColor: "#e3f2fd",
	},
	render: (args) => (
		<ScreenContainer {...args}>
			<DemoContent />
		</ScreenContainer>
	),
	parameters: {
		docs: {
			description: {
				story: "커스텀 배경색을 사용하는 예제입니다.",
			},
		},
	},
};

export const ScrollableContent: Story = {
	render: (args) => (
		<ScreenContainer {...args}>
			<View style={demoStyles.scrollContent}>
				{Array.from({ length: 20 }, (_, index) => (
					<View key={index} style={demoStyles.scrollItem}>
						<Text variant="body1">스크롤 아이템 {index + 1}</Text>
					</View>
				))}
			</View>
		</ScreenContainer>
	),
	parameters: {
		docs: {
			description: {
				story: "스크롤 가능한 콘텐츠와 함께 사용하는 예제입니다.",
			},
		},
	},
};

const demoStyles = StyleSheet.create({
	content: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	title: {
		textAlign: "center",
		marginBottom: 16,
	},
	description: {
		textAlign: "center",
		marginBottom: 24,
		paddingHorizontal: 20,
	},
	button: {
		marginTop: 16,
	},
	scrollContent: {
		padding: 20,
	},
	scrollItem: {
		padding: 16,
		marginBottom: 8,
		borderRadius: 8,
		backgroundColor: "rgba(0, 0, 0, 0.05)",
	},
});
