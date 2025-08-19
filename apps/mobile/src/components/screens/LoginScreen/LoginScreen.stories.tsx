import type { Meta, StoryObj } from "@storybook/react-native";
import React from "react";
import { View } from "react-native";
import { LoginScreen } from "./index";
import type { LoginScreenProps } from "./LoginScreen";

const meta: Meta<LoginScreenProps> = {
	title: "screens/LoginScreen",
	component: LoginScreen,
	parameters: {
		layout: "fullscreen",
		docs: {
			description: {
				component: "완성된 로그인 스크린 컴포넌트입니다. 로그인 폼, 소셜 로그인, 링크 버튼들을 포함합니다.",
			},
		},
	},
	argTypes: {
		onLogin: {
			action: "로그인",
			description: "로그인 버튼 클릭 시 호출되는 함수",
		},
		onSignUp: {
			action: "회원가입",
			description: "회원가입 버튼 클릭 시 호출되는 함수",
		},
		onForgotPassword: {
			action: "비밀번호 찾기",
			description: "비밀번호 찾기 버튼 클릭 시 호출되는 함수",
		},
		onGoogleLogin: {
			action: "구글 로그인",
			description: "구글 로그인 버튼 클릭 시 호출되는 함수",
		},
		onAppleLogin: {
			action: "애플 로그인",
			description: "애플 로그인 버튼 클릭 시 호출되는 함수",
		},
		onKakaoLogin: {
			action: "카카오 로그인",
			description: "카카오 로그인 버튼 클릭 시 호출되는 함수",
		},
	},
};

export default meta;
type Story = StoryObj<LoginScreenProps>;

export const 기본: Story = {
	render: (args) => (
		<View style={{ flex: 1, backgroundColor: "#ffffff" }}>
			<LoginScreen {...args} />
		</View>
	),
};

export const 콜백함수포함: Story = {
	render: (args) => (
		<View style={{ flex: 1, backgroundColor: "#ffffff" }}>
			<LoginScreen
				{...args}
				onLogin={(email, password, keepLoggedIn) => 
					console.log("로그인:", { email, password, keepLoggedIn })
				}
				onSignUp={() => console.log("회원가입")}
				onForgotPassword={() => console.log("비밀번호 찾기")}
				onGoogleLogin={() => console.log("구글 로그인")}
				onAppleLogin={() => console.log("애플 로그인")}
				onKakaoLogin={() => console.log("카카오 로그인")}
			/>
		</View>
	),
};

export const 플레이그라운드: Story = {
	args: {},
	render: (args) => (
		<View style={{ flex: 1, backgroundColor: "#ffffff" }}>
			<LoginScreen {...args} />
		</View>
	),
};