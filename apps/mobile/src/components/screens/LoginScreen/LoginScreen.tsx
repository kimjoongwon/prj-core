import React from "react";
import { 
	ScrollView, 
	KeyboardAvoidingView, 
	Platform, 
	StyleSheet,
	ViewStyle 
} from "react-native";
import { observable } from "mobx";
import { observer } from "mobx-react-lite";
import { View } from "../../ui/View";
import { Text } from "../../ui/Text";
import { Button } from "../../ui/Button";
import { Logo } from "../../ui/Logo";
import { Divider } from "../../ui/Divider";
import { SNSButtons } from "../../ui/SNSButtons";
import { LoginForm, LoginFormState } from "../../forms/LoginForm";
import { Checkbox } from "../../forms/Checkbox";

export interface LoginScreenProps {
	onLogin?: (email: string, password: string, keepLoggedIn: boolean) => void;
	onSignUp?: () => void;
	onForgotPassword?: () => void;
	onGoogleLogin?: () => void;
	onAppleLogin?: () => void;
	onKakaoLogin?: () => void;
	style?: ViewStyle;
}

export const LoginScreen: React.FC<LoginScreenProps> = observer(({
	onLogin,
	onSignUp,
	onForgotPassword,
	onGoogleLogin,
	onAppleLogin,
	onKakaoLogin,
	style,
}) => {
	const [loginState] = React.useState(() => 
		observable<LoginFormState>({
			email: "",
			password: "",
		})
	);

	const [keepLoggedIn, setKeepLoggedIn] = React.useState(false);

	const handleLogin = () => {
		onLogin?.(loginState.email, loginState.password, keepLoggedIn);
	};

	return (
		<KeyboardAvoidingView
			style={styles.container}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
		>
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={[styles.content, style]}
				keyboardShouldPersistTaps="handled"
			>
				{/* 로고 영역 */}
				<View style={styles.logoSection}>
					<Logo size="lg" />
				</View>

				{/* 헤더 영역 */}
				<View style={styles.headerSection}>
					<Text variant="h3" style={styles.title}>
						로그인
					</Text>
					<Text variant="body1" color="default" style={styles.subtitle}>
						계정에 로그인하세요
					</Text>
				</View>

				{/* 로그인 폼 */}
				<View style={styles.formSection}>
					<LoginForm state={loginState} />
					
					{/* 로그인 상태 유지 */}
					<View style={styles.checkboxContainer}>
						<Checkbox
							state={{ keepLoggedIn }}
							path="keepLoggedIn"
							label="로그인 상태 유지"
							onValueChange={setKeepLoggedIn}
						/>
					</View>

					{/* 로그인 버튼 */}
					<Button
						variant="solid"
						color="primary"
						size="lg"
						style={styles.loginButton}
						onPress={handleLogin}
					>
						로그인
					</Button>
				</View>

				{/* 구분선 */}
				<Divider style={styles.divider}>또는</Divider>

				{/* 소셜 로그인 */}
				<View style={styles.socialSection}>
					<SNSButtons
						onGooglePress={onGoogleLogin}
						onApplePress={onAppleLogin}
						onKakaoPress={onKakaoLogin}
					/>
				</View>

				{/* 하단 링크들 */}
				<View style={styles.linksSection}>
					<Button
						variant="ghost"
						size="md"
						onPress={onSignUp}
						style={styles.linkButton}
					>
						회원가입
					</Button>
					<Button
						variant="ghost"
						size="md"
						onPress={onForgotPassword}
						style={styles.linkButton}
					>
						비밀번호 찾기
					</Button>
				</View>
			</ScrollView>
		</KeyboardAvoidingView>
	);
});

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollView: {
		flex: 1,
	},
	content: {
		padding: 24,
		paddingTop: 60,
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
	},
	subtitle: {
		textAlign: "center",
	},
	formSection: {
		marginBottom: 24,
	},
	checkboxContainer: {
		marginVertical: 16,
	},
	loginButton: {
		marginTop: 8,
	},
	divider: {
		marginVertical: 24,
	},
	socialSection: {
		marginBottom: 32,
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