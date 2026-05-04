import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Button } from "@cocrepo/mo-ui";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { Href } from "expo-router";
import { getAuthenticatedHomePath } from "@/auth/auth-config";
import { mobileAuthStore } from "@/auth/auth-store";
import {
	buildAuthCallbackErrorState,
	buildAuthCallbackLoadingState,
	type MobileAuthCallbackTransitionState,
	verifySession,
} from "@/auth/_utils/auth";

const AUTH_CLIENT_ID = "idp-web";
const AUTH_CALLBACK_SCHEME = "prjcore";
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
							"오노라 인증 서버 콜백은 완료됐지만 앱 세션 확인에 실패했습니다.",
							nextState.exchange,
						),
					);
					return;
				}

				router.replace(nextState.nextRoute as Href);
			}
		};

		void process().catch(() => {
			setUiState(
				buildAuthCallbackErrorState(
					DEFAULT_NEXT_ROUTE,
					"오노라 인증 콜백 처리 중 오류가 발생했습니다.",
				),
			);
		});
	}, [params, router]);

	const onPressRetryLoginButton = () => {
		router.replace({
			pathname: "/auth/login",
			params: { returnTo: uiState.nextRoute || DEFAULT_NEXT_ROUTE },
		});
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>오노라 인증</Text>
			<Text style={styles.message}>안내: {uiState.message}</Text>
			<Text style={styles.message}>복귀 경로: {uiState.nextRoute}</Text>

			{uiState.status === "loading" && (
				<View style={styles.statusRow}>
					<ActivityIndicator color="#60a5fa" size="small" />
					<Text style={styles.subText}>오노라 인증 응답을 확인하고 있습니다.</Text>
				</View>
			)}
			{uiState.status === "error" && (
				<Button onPress={onPressRetryLoginButton} variant="secondary">
					오노라 로그인으로 다시 이동
				</Button>
			)}
		</View>
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
