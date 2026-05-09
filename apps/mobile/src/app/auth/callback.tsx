import { ActivityIndicator, Text, View } from "react-native";
import { Button, ScreenFrame } from "@cocrepo/mo-ui";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { Href } from "expo-router";
import { tv } from "tailwind-variants";
import {
	getAuthenticatedHomePath,
	resolveAuthenticatedRoutePath,
} from "@/auth/auth-config";
import { mobileAuthStore } from "@/auth/auth-store";
import {
	buildAuthCallbackErrorState,
	buildAuthCallbackLoadingState,
	type MobileAuthCallbackTransitionState,
	verifySession,
} from "@/auth/_utils/auth";

const AUTH_CLIENT_ID = "user-mobile";
const AUTH_CALLBACK_SCHEME = "kr.co.cocdev.onoramobile";
const AUTH_CALLBACK_PATH = "auth/callback";
const DEFAULT_NEXT_ROUTE = getAuthenticatedHomePath();

const AuthCallbackRoute = observer(() => {
	const router = useRouter();
	const params = useLocalSearchParams() as Record<
		string,
		string | string[] | undefined
	>;
	const handledRef = useRef(false);
	const [uiState, setUiState] = useState<MobileAuthCallbackTransitionState>(
		buildAuthCallbackLoadingState(),
	);

	useEffect(() => {
		if (handledRef.current) {
			return;
		}

		handledRef.current = true;
		const process = async () => {
			const nextState = await verifySession(params, {
				clientId: AUTH_CLIENT_ID,
				callbackScheme: AUTH_CALLBACK_SCHEME,
				callbackPath: AUTH_CALLBACK_PATH,
			});

			setUiState(nextState);

			if (nextState.status === "success") {
				const isNativeSessionVerified = await mobileAuthStore.verifySession();
				if (!isNativeSessionVerified) {
					setUiState(
						buildAuthCallbackErrorState(
							nextState.nextRoute,
							"로그인은 완료됐지만 앱에서 세션을 확인하지 못했습니다. 다시 로그인해 주세요.",
							nextState.exchange,
						),
					);
					return;
				}

				router.replace(resolveAuthenticatedRoutePath(nextState.nextRoute) as Href);
			}
		};

		void process().catch(() => {
			setUiState(
				buildAuthCallbackErrorState(
					DEFAULT_NEXT_ROUTE,
					"로그인 완료 처리 중 문제가 발생했습니다. 다시 시도해 주세요.",
				),
			);
		});
	}, [params, router]);

	const onPressRetryLoginButton = () => {
		router.replace({
			pathname: "/auth/login",
			params: {
				returnTo: resolveAuthenticatedRoutePath(
					uiState.nextRoute || DEFAULT_NEXT_ROUTE,
				),
			},
		} as unknown as Href);
	};

	return (
		<ScreenFrame
			className={classNames.screenFrame()}
			contentClassName={classNames.container()}
		>
			<Text className={classNames.title()}>
				{uiState.status === "error"
					? "로그인이 완료되지 않았어요"
					: "오노라로 돌아가는 중"}
			</Text>
			<Text className={classNames.message()}>{uiState.message}</Text>

			{uiState.status === "loading" && (
				<View className={classNames.statusRow()}>
					<ActivityIndicator colorClassName="text-blue-400" size="small" />
					<Text className={classNames.subText()}>
						예약 정보를 안전하게 불러올 준비를 하고 있습니다.
					</Text>
				</View>
			)}
			{uiState.status === "error" && (
				<Button onPress={onPressRetryLoginButton} variant="secondary">
					로그인 다시 시도
				</Button>
			)}
		</ScreenFrame>
	);
});

export default AuthCallbackRoute;

const authCallbackRouteClassNames = tv({
	slots: {
		container: "flex-1 items-center justify-center gap-[14px] bg-slate-950 p-5",
		message: "text-sm text-blue-200",
		screenFrame: "bg-slate-950",
		statusRow: "items-center gap-2.5",
		subText: "text-[13px] text-blue-300",
		title: "text-2xl font-extrabold text-slate-50",
	},
});

const classNames = authCallbackRouteClassNames();
