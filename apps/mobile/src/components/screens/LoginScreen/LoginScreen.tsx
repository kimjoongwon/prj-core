import React from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import { View } from "@/components/ui/View";
import { ScrollView } from "@/components/ui/ScrollView";
import { Text } from "@/components/ui/Text";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Divider } from "@/components/ui/Divider";
import { Header } from "@/components/ui/Header";
import { LoginForm, LoginFormState } from "@/components/forms/LoginForm";
import { useTheme, type Theme } from "@/components/contexts/ThemeContext";

export interface LoginScreenProps {
	onLogin?: (email: string, password: string, keepLoggedIn: boolean) => void;
	onSignUp?: () => void;
	onForgotPassword?: () => void;
	onGoogleLogin?: () => void;
	onAppleLogin?: () => void;
	onKakaoLogin?: () => void;
	onBack?: () => void;
	style?: ViewStyle;
}

export const LoginScreen: React.FC<LoginScreenProps> = observer(
	({
		onLogin,
		onSignUp,
		onForgotPassword,
		onGoogleLogin,
		onAppleLogin,
		onKakaoLogin,
		onBack,
		style,
	}) => {
		const { theme } = useTheme();
		const [loginState] = React.useState(() =>
			observable<LoginFormState>({
				email: "",
				password: "",
			}),
		);

		const dynamicStyles = createStyles(theme);

		return (
			<View style={dynamicStyles.container}>
				<Header
					title="로그인"
					variant="default"
					leftAction={
						onBack
							? {
									title: "뒤로",
									onPress: onBack,
									variant: "ghost",
								}
							: undefined
					}
				/>
				<ScrollView
					variant="default"
					style={[dynamicStyles.scrollView]}
					contentContainerStyle={[dynamicStyles.content, style]}
					keyboardShouldPersistTaps="handled"
				>
					{/* 로고 영역 */}
					<View style={dynamicStyles.logoSection}>
						<Logo size="lg" />
					</View>

					{/* 헤더 영역 */}
					<View style={dynamicStyles.headerSection}>
						<Text variant="h3" style={dynamicStyles.title}>
							로그인
						</Text>
						<Text
							variant="body1"
							color="default"
							style={dynamicStyles.subtitle}
						>
							계정에 로그인하세요
						</Text>
					</View>

					{/* 로그인 폼 */}
					<View style={dynamicStyles.formSection}>
						<LoginForm state={loginState} />

						{/* 로그인 버튼 */}
						<Button
							variant="solid"
							color="primary"
							size="lg"
							style={dynamicStyles.loginButton}
							onPress={() =>
								onLogin?.(loginState.email, loginState.password, false)
							}
						>
							로그인
						</Button>
					</View>

					{/* 구분선 */}
					<Divider style={dynamicStyles.divider}>또는</Divider>

					{/* 하단 링크들 */}
					<View style={dynamicStyles.linksSection}>
						<Button
							variant="ghost"
							size="md"
							onPress={onSignUp}
							style={dynamicStyles.linkButton}
						>
							회원가입
						</Button>
						<Button
							variant="ghost"
							size="md"
							onPress={onForgotPassword}
							style={dynamicStyles.linkButton}
						>
							비밀번호 찾기
						</Button>
					</View>
				</ScrollView>
			</View>
		);
	},
);

const createStyles = (theme: Theme) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: theme.colors.background,
		},
		scrollView: {
			flex: 1,
		},
		content: {
			padding: 24,
			paddingTop: 20,
			paddingBottom: 40,
		},
		logoSection: {
			alignItems: "center",
			marginBottom: 40,
		},
		headerSection: {
			alignItems: "center",
			marginBottom: 32,
		},
		title: {
			marginBottom: 8,
			color: theme.colors.foreground,
		},
		subtitle: {
			textAlign: "center",
			color: theme.colors.default[600],
		},
		formSection: {
			marginBottom: 24,
		},
		loginButton: {
			marginTop: 8,
		},
		divider: {
			marginVertical: 24,
		},
		linksSection: {
			alignItems: "center",
			gap: 8,
		},
		linkButton: {
			marginVertical: 4,
		},
	});

export default LoginScreen;
