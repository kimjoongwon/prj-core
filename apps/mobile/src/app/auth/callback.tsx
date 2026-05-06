import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Button, ScreenFrame } from "@cocrepo/mo-ui";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { Href } from "expo-router";
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

export default observer(function AuthCallbackRoute() {
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
		<ScreenFrame backgroundColor="#020617" contentStyle={styles.container}>
			<Text style={styles.title}>
				{uiState.status === "error"
					? "로그인이 완료되지 않았어요"
					: "오노라로 돌아가는 중"}
			</Text>
			<Text style={styles.message}>{uiState.message}</Text>

			{uiState.status === "loading" && (
				<View style={styles.statusRow}>
					<ActivityIndicator color="#60a5fa" size="small" />
					<Text style={styles.subText}>
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

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		backgroundColor: "#020617",
		flex: 1,
		gap: 14,
		justifyContent: "center",
		padding: 20,
	},
	title: {
		color: "#f8fafc",
		fontSize: 24,
		fontWeight: "800",
	},
	message: {
		color: "#bfdbfe",
		fontSize: 14,
	},
	subText: {
		color: "#93c5fd",
		fontSize: 13,
	},
	statusRow: {
		alignItems: "center",
		gap: 10,
	},
});
