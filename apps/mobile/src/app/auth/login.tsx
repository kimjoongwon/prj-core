import { Button, Icon, ScreenFrame, Spinner } from "@cocrepo/mo-ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { Href } from "expo-router";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import {
	KeyboardAvoidingView,
	Platform,
	Text,
	TextInput,
	View,
} from "react-native";
import { tv } from "tailwind-variants";
import {
	getAuthenticatedHomePath,
	getSpaceSelectPath,
	resolveAuthenticatedRoutePath,
} from "@/auth/auth-config";
import { mobileSession } from "@/auth/mobile-session";
import { mobileApiScope } from "@/auth/mobile-api-scope";
import {
	NativeAuthRequestError,
	parseAuthLoginParams,
} from "@/auth/_utils/auth";

const buildLoginTarget = (
	params: Record<string, string | string[] | undefined>,
) => {
	const parsed = parseAuthLoginParams(params);
	return resolveAuthenticatedRoutePath(
		parsed.returnTo || getAuthenticatedHomePath(),
	);
};

const AuthLoginRoute = observer(() => {
	const router = useRouter();
	const rawParams = useLocalSearchParams() as Record<
		string,
		string | string[] | undefined
	>;
	const targetReturnTo = buildLoginTarget(rawParams);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const onChangeEmailInput = (value: string) => {
		setEmail(value);
		if (errorMessage) {
			setErrorMessage("");
		}
	};

	const onChangePasswordInput = (value: string) => {
		setPassword(value);
		if (errorMessage) {
			setErrorMessage("");
		}
	};

	const onPressLoginButton = async () => {
		const normalizedEmail = email.trim();
		if (!normalizedEmail || !password) {
			setErrorMessage("이메일과 비밀번호를 입력해 주세요.");
			return;
		}

		setIsSubmitting(true);
		setErrorMessage("");
		try {
			mobileSession.setNextPathAfterLogin(targetReturnTo);
			const loggedIn = await mobileSession.loginWithCredentials(
				normalizedEmail,
				password,
			);
			if (!loggedIn) {
				setErrorMessage("로그인 세션을 확인하지 못했습니다. 다시 시도해 주세요.");
				return;
			}

			if (!mobileApiScope.isSpaceSelectionResolved) {
				router.replace({
					pathname: getSpaceSelectPath(),
					params: { returnTo: targetReturnTo },
				} as unknown as Href);
				return;
			}

			router.replace(resolveAuthenticatedRoutePath(targetReturnTo) as Href);
		} catch (error) {
			setErrorMessage(
				error instanceof NativeAuthRequestError || error instanceof Error
					? error.message
					: "로그인에 실패했습니다. 다시 시도해 주세요.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<ScreenFrame
			className={classNames.screenFrame()}
			contentClassName={classNames.container()}
		>
			<KeyboardAvoidingView
				behavior={Platform.OS === "ios" ? "padding" : undefined}
				className={classNames.keyboardView()}
			>
				<View className={classNames.header()}>
					<Text className={classNames.eyebrow()}>ONORA</Text>
					<Text className={classNames.title()}>로그인</Text>
					<Text className={classNames.description()}>
						예약과 내 공간 정보를 바로 이어서 확인할 수 있습니다.
					</Text>
				</View>

				<View className={classNames.form()}>
					<View className={classNames.field()}>
						<Text className={classNames.label()}>이메일</Text>
						<View className={classNames.inputFrame()}>
							<Icon name="mail" size="sm" tone="muted" />
							<TextInput
								accessibilityLabel="이메일"
								autoCapitalize="none"
								autoComplete="email"
								className={classNames.input()}
								editable={!isSubmitting}
								keyboardType="email-address"
								onChangeText={onChangeEmailInput}
								placeholder="name@example.com"
								placeholderTextColorClassName="text-muted"
								returnKeyType="next"
								textContentType="username"
								value={email}
							/>
						</View>
					</View>

					<View className={classNames.field()}>
						<Text className={classNames.label()}>비밀번호</Text>
						<View className={classNames.inputFrame()}>
							<Icon name="lockKeyhole" size="sm" tone="muted" />
							<TextInput
								accessibilityLabel="비밀번호"
								autoCapitalize="none"
								className={classNames.input()}
								editable={!isSubmitting}
								onChangeText={onChangePasswordInput}
								onSubmitEditing={onPressLoginButton}
								placeholder="비밀번호"
								placeholderTextColorClassName="text-muted"
								returnKeyType="done"
								secureTextEntry
								textContentType="password"
								value={password}
							/>
						</View>
					</View>

					{errorMessage ? (
						<Text accessibilityRole="alert" className={classNames.errorText()}>
							{errorMessage}
						</Text>
					) : null}

					<Button
						accessibilityLabel="login-submit"
						className="rounded-lg"
						isDisabled={isSubmitting}
						onPress={onPressLoginButton}
						variant="primary"
					>
						{isSubmitting ? (
							<View className={classNames.buttonContent()}>
								<Spinner color="default" size="sm" />
								<Text className={classNames.buttonText()}>로그인 중</Text>
							</View>
						) : (
							<View className={classNames.buttonContent()}>
								<Icon name="logIn" size="sm" tone="accentForeground" />
								<Text className={classNames.buttonText()}>로그인</Text>
							</View>
						)}
					</Button>
				</View>
			</KeyboardAvoidingView>
		</ScreenFrame>
	);
});

export default AuthLoginRoute;

const loginRouteClassNames = tv({
	slots: {
		buttonContent: "flex-row items-center justify-center gap-2",
		buttonText: "text-sm font-semibold text-accent-foreground",
		container: "flex-1 bg-background px-4 py-6",
		description: "text-sm leading-5 text-muted",
		errorText:
			"rounded-lg border border-danger bg-danger-soft px-3 py-2 text-[13px] font-medium leading-5 text-danger",
		eyebrow: "text-xs font-extrabold uppercase tracking-[0px] text-accent",
		field: "gap-2",
		form: "gap-4",
		header: "gap-2 border-b border-border pb-6 pt-8",
		input:
			"min-h-12 flex-1 text-[15px] text-foreground",
		inputFrame:
			"min-h-12 flex-row items-center gap-2 rounded-lg border border-border bg-surface px-3",
		keyboardView: "flex-1 justify-center",
		label: "text-[13px] font-bold leading-5 text-foreground",
		screenFrame: "bg-background",
		title: "text-[28px] font-extrabold leading-8 text-foreground",
	},
});

const classNames = loginRouteClassNames();
