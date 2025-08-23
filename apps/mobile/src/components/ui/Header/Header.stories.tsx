import type { Meta, StoryObj } from "@storybook/react";
import { View } from "react-native";
import { Text } from "@/components/ui/Text";
import { Header } from "./Header";

const meta: Meta<typeof Header> = {
	title: "ui/Header",
	component: Header,
	parameters: {
		layout: "fullscreen",
	},
	argTypes: {
		variant: {
			control: { type: "select" },
			options: ["default", "transparent", "elevated"],
		},
		statusBarStyle: {
			control: { type: "select" },
			options: ["auto", "light", "dark", "inverted"],
		},
	},
};

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 헤더
export const Default: Story = {
	render: (args) => (
		<View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
			<Header {...args} />
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text variant="body1">기본 헤더 예시</Text>
			</View>
		</View>
	),
	args: {
		title: "기본 헤더",
	},
};

// 제목과 부제목이 있는 헤더
export const WithSubtitle: Story = {
	render: (args) => (
		<View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
			<Header {...args} />
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text variant="body1">제목과 부제목이 있는 헤더</Text>
			</View>
		</View>
	),
	args: {
		title: "메인 제목",
		subtitle: "부제목 텍스트",
	},
};

// 왼쪽 액션이 있는 헤더
export const WithLeftAction: Story = {
	render: (args) => (
		<View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
			<Header {...args} />
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text variant="body1">왼쪽 버튼이 있는 헤더</Text>
			</View>
		</View>
	),
	args: {
		title: "페이지 제목",
		leftAction: {
			title: "뒤로",
			onPress: () => console.log("뒤로 가기"),
			variant: "ghost",
		},
	},
};

// 오른쪽 액션이 있는 헤더
export const WithRightAction: Story = {
	render: (args) => (
		<View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
			<Header {...args} />
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text variant="body1">오른쪽 버튼이 있는 헤더</Text>
			</View>
		</View>
	),
	args: {
		title: "설정",
		rightAction: {
			title: "저장",
			onPress: () => console.log("저장하기"),
			variant: "solid",
			color: "primary",
		},
	},
};

// 양쪽 액션이 모두 있는 헤더
export const WithBothActions: Story = {
	render: (args) => (
		<View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
			<Header {...args} />
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text variant="body1">양쪽 버튼이 모두 있는 헤더</Text>
			</View>
		</View>
	),
	args: {
		title: "편집",
		leftAction: {
			title: "취소",
			onPress: () => console.log("취소"),
			variant: "ghost",
		},
		rightAction: {
			title: "완료",
			onPress: () => console.log("완료"),
			variant: "solid",
			color: "primary",
		},
	},
};

// 투명 헤더
export const Transparent: Story = {
	render: (args) => (
		<View style={{ flex: 1 }}>
			<View
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					backgroundColor: "#4a90e2",
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<Text variant="h4" style={{ color: "white" }}>
					배경 컨텐츠
				</Text>
			</View>
			<Header {...args} />
		</View>
	),
	args: {
		title: "투명 헤더",
		variant: "transparent",
		leftAction: {
			title: "뒤로",
			onPress: () => console.log("뒤로 가기"),
			variant: "ghost",
		},
		rightAction: {
			title: "공유",
			onPress: () => console.log("공유하기"),
			variant: "ghost",
		},
	},
};

// 그림자가 있는 헤더
export const Elevated: Story = {
	render: (args) => (
		<View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
			<Header {...args} />
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text variant="body1">그림자가 있는 헤더</Text>
			</View>
		</View>
	),
	args: {
		title: "그림자 헤더",
		variant: "elevated",
		rightAction: {
			title: "메뉴",
			onPress: () => console.log("메뉴"),
			variant: "ghost",
		},
	},
};

// 커스텀 중앙 컨텐츠
export const WithCustomCenter: Story = {
	render: (args) => (
		<View style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
			<Header
				{...args}
				centerContent={
					<View style={{ alignItems: "center" }}>
						<Text variant="h6" style={{ color: "#4a90e2" }}>
							커스텀 제목
						</Text>
						<Text variant="caption" color="default">
							특별한 스타일
						</Text>
					</View>
				}
			/>
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text variant="body1">커스텀 중앙 컨텐츠가 있는 헤더</Text>
			</View>
		</View>
	),
	args: {
		leftAction: {
			title: "뒤로",
			onPress: () => console.log("뒤로 가기"),
			variant: "ghost",
		},
	},
};

// 다크모드 테스트
export const DarkModeTest: Story = {
	render: (args) => (
		<View style={{ flex: 1 }}>
			<Header {...args} />
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
					padding: 20,
				}}
			>
				<Text variant="body1" style={{ textAlign: "center", marginBottom: 16 }}>
					다크모드 토글을 사용해서 테마 변경을 테스트해보세요.
				</Text>
				<Text variant="caption" color="default" style={{ textAlign: "center" }}>
					헤더의 배경, 텍스트, 그림자가 자동으로 변경됩니다.
				</Text>
			</View>
		</View>
	),
	args: {
		title: "다크모드 테스트",
		subtitle: "테마 변경 확인",
		variant: "elevated",
		leftAction: {
			title: "뒤로",
			onPress: () => console.log("뒤로 가기"),
			variant: "ghost",
		},
		rightAction: {
			title: "설정",
			onPress: () => console.log("설정"),
			variant: "ghost",
		},
	},
};
