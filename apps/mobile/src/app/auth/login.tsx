import { Button, Icon, ScreenFrame, Spinner } from "@cocrepo/mo-ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { Href } from "expo-router";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { tv } from "tailwind-variants";
import {
	getAuthenticatedHomePath,
	getSpaceSelectPath,
	resolveAuthenticatedRoutePath,
} from "@/auth/auth-config";
import { mobileSession } from "@/auth/mobile-session";
import { mobileApiScope } from "@/auth/mobile-api-scope";
import { openOidcAuthPage } from "@/auth/oidc/oidc-login";
import { parseAuthLoginParams } from "@/auth/_utils/auth";

const buildLoginTarget = (
	params: Record<string, string | string[] | undefined>,
) => {
	const parsed = parseAuthLoginParams(params);
	return resolveAuthenticatedRoutePath(
		parsed.returnTo || getAuthenticatedHomePath(),
	);
};

/**
 * IDP 시트 로그인 화면.
 * 자격증명 입력은 IDP 로그인 화면(idp-web)에서 이뤄지고 이 화면은
 * 시스템 인증 세션을 띄워 IDP로 보낼 뿐이다. 회원가입/비밀번호 재설정은
 * IDP 웹 페이지로 이동한다.
 */
const AuthLoginRoute = observer(() => {
	const router = useRouter();
	const rawParams = useLocalSearchParams() as Record<
		string,
		string | string[] | undefined
	>;
	const targetReturnTo = buildLoginTarget(rawParams);
	const [errorMessage, setErrorMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const onPressOidcLoginButton = async () => {
		setIsSubmitting(true);
		setErrorMessage("");
		try {
			mobileSession.setNextPathAfterLogin(targetReturnTo);
			const loggedIn = await mobileSession.loginWithOidc();
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
			const message = error instanceof Error ? error.message : "";
			if (message !== "oidc_auth_session_cancelled") {
				setErrorMessage(
					message || "로그인에 실패했습니다. 다시 시도해 주세요.",
				);
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<ScreenFrame
			className={classNames.screenFrame()}
			contentClassName={classNames.container()}
		>
			<View className={classNames.centerView()}>
				<View className={classNames.header()}>
					<Text className={classNames.eyebrow()}>ONORA</Text>
					<Text className={classNames.title()}>로그인</Text>
					<Text className={classNames.description()}>
						로그인은 IDP(onjitda)를 통해 진행됩니다. 시트에서 계정에
						로그인하면 앱으로 자동으로 돌아옵니다.
					</Text>
				</View>

				<View className={classNames.form()}>
					{errorMessage ? (
						<Text accessibilityRole="alert" className={classNames.errorText()}>
							{errorMessage}
						</Text>
					) : null}

					<Button
						accessibilityLabel="oidc-login-submit"
						className="rounded-lg"
						isDisabled={isSubmitting}
						onPress={onPressOidcLoginButton}
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
								<Text className={classNames.buttonText()}>IDP로 로그인</Text>
							</View>
						)}
					</Button>

					<View className={classNames.auxLinks()}>
						<Pressable
							accessibilityLabel="open-idp-sign-up"
							onPress={() => openOidcAuthPage("/auth/sign-up")}
						>
							<Text className={classNames.auxLinkText()}>회원가입</Text>
						</Pressable>
						<Text className={classNames.auxLinkDivider()}>·</Text>
						<Pressable
							accessibilityLabel="open-idp-forgot-password"
							onPress={() => openOidcAuthPage("/auth/forgot-password")}
						>
							<Text className={classNames.auxLinkText()}>비밀번호 찾기</Text>
						</Pressable>
					</View>
				</View>
			</View>
		</ScreenFrame>
	);
});

export default AuthLoginRoute;

const loginRouteClassNames = tv({
	slots: {
		buttonContent: "flex-row items-center justify-center gap-2",
		buttonText: "text-sm font-semibold text-accent-foreground",
		centerView: "flex-1 justify-center",
		container: "flex-1 bg-background px-4 py-6",
		description: "text-sm leading-5 text-muted",
		errorText:
			"rounded-lg border border-danger bg-danger-soft px-3 py-2 text-[13px] font-medium leading-5 text-danger",
		eyebrow: "text-xs font-extrabold uppercase tracking-[0px] text-accent",
		form: "gap-4",
		header: "gap-2 border-b border-border pb-6 pt-8",
		auxLinks: "flex-row items-center justify-center gap-3 pt-2",
		auxLinkText: "text-[13px] font-semibold text-accent",
		auxLinkDivider: "text-[13px] text-muted",
		screenFrame: "bg-background",
		title: "text-[28px] font-extrabold leading-8 text-foreground",
	},
});

const classNames = loginRouteClassNames();
