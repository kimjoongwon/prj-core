import {
	Button,
	HStack,
	Icon,
	LinkButton,
	ScreenFrame,
	Spinner,
	Typography,
	VStack,
} from "@cocrepo/mo-ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { Href } from "expo-router";
import { observer } from "mobx-react-lite";
import { useState } from "react";
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
			<VStack className={classNames.centerView()} justifyContent="center">
				<VStack className={classNames.header()} gap="block">
					<Typography
						className="font-extrabold uppercase tracking-wide text-accent"
						type="body-xs"
					>
						PLATE
					</Typography>
					<Typography className={classNames.title()} type="body-sm">
						로그인
					</Typography>
					<Typography color="muted" type="body-sm">
						로그인은 IDP(onjitda)를 통해 진행됩니다. 시트에서 계정에
						로그인하면 앱으로 자동으로 돌아옵니다.
					</Typography>
				</VStack>

				<VStack gap="section">
					{errorMessage ? (
						<Typography
							accessibilityRole="alert"
							className={classNames.errorText()}
							type="body-sm"
						>
							{errorMessage}
						</Typography>
					) : null}

					<Button
						accessibilityLabel="oidc-login-submit"
						isDisabled={isSubmitting}
						onPress={onPressOidcLoginButton}
						variant="primary"
					>
						{isSubmitting ? (
							<HStack
								alignItems="center"
								gap="inline"
								justifyContent="center"
							>
								<Spinner color="default" size="sm" />
								<Typography
									className="text-accent-foreground"
									type="body-sm"
									weight="semibold"
								>
									로그인 중
								</Typography>
							</HStack>
						) : (
							<HStack
								alignItems="center"
								gap="inline"
								justifyContent="center"
							>
								<Icon name="logIn" size="sm" tone="accentForeground" />
								<Typography
									className="text-accent-foreground"
									type="body-sm"
									weight="semibold"
								>
									IDP로 로그인
								</Typography>
							</HStack>
						)}
					</Button>

					<HStack
						alignItems="center"
						className={classNames.auxLinks()}
						gap="block"
						justifyContent="center"
					>
						<LinkButton
							accessibilityLabel="open-idp-sign-up"
							onPress={() => openOidcAuthPage("/auth/sign-up")}
						>
							<Typography
								className="text-accent"
								type="body-sm"
								weight="semibold"
							>
								회원가입
							</Typography>
						</LinkButton>
						<Typography className={classNames.auxLinkDivider()} type="body-sm">
							·
						</Typography>
						<LinkButton
							accessibilityLabel="open-idp-forgot-password"
							onPress={() => openOidcAuthPage("/auth/forgot-password")}
						>
							<Typography
								className="text-accent"
								type="body-sm"
								weight="semibold"
							>
								비밀번호 찾기
							</Typography>
						</LinkButton>
					</HStack>
				</VStack>
			</VStack>
		</ScreenFrame>
	);
});

export default AuthLoginRoute;

const loginRouteClassNames = tv({
	slots: {
		auxLinks: "pt-2",
		auxLinkDivider: "text-[13px] text-muted",
		centerView: "flex-1",
		container: "flex-1 bg-background px-4 py-6",
		errorText:
			"rounded-lg border border-danger bg-danger-soft px-3 py-2 text-[13px] font-medium leading-5 text-danger",
		header: "border-b border-border pb-6 pt-8",
		screenFrame: "bg-background",
		title: "text-[28px] font-extrabold leading-8 text-foreground",
	},
});

const classNames = loginRouteClassNames();
