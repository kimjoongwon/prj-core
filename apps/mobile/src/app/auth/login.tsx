import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Button } from "@cocrepo/mo-ui";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import {
	buildAuthCallbackRouteParams,
	createLoginErrorState,
	createLoginLoadingState,
	createLoginSuccessState,
	buildAuthLoginUrl,
	isAuthCallbackUrl,
	parseAuthLoginParams,
	rewriteLocalhostUrlForAndroidEmulator,
	type AuthLoginFlowState,
} from "@/auth/_utils/auth";
import { getAuthenticatedHomePath } from "@/auth/auth-config";
import { mobileAuthStore } from "@/auth/auth-store";

const AUTH_CLIENT_ID = "idp-web";
const AUTH_CALLBACK_SCHEME = "prjcore";
const AUTH_CALLBACK_PATH = "auth/callback";

interface LoginWebViewRequest {
	url: string;
}

interface LoginWebViewErrorEvent {
	nativeEvent: {
		description?: string;
	};
}

const buildLoginFlow = (params: Record<string, string | string[] | undefined>) => {
	const parsed = parseAuthLoginParams(params);
	const targetReturnTo = parsed.returnTo || getAuthenticatedHomePath();

	const loginUrl = buildAuthLoginUrl({
		clientId: AUTH_CLIENT_ID,
		targetReturnTo,
		callbackScheme: AUTH_CALLBACK_SCHEME,
		callbackPath: AUTH_CALLBACK_PATH,
	});

	return { loginUrl, targetReturnTo };
};

const prepareLoginFlow = (
	loginUrl: string,
	targetReturnTo: string,
	setFlowState: (flowState: AuthLoginFlowState) => void,
) => {
	mobileAuthStore.setNextPathAfterLogin(targetReturnTo);
	setFlowState(createLoginSuccessState(loginUrl));
};

const isCallbackRequest = (url: string) => isAuthCallbackUrl(url, {
	callbackScheme: AUTH_CALLBACK_SCHEME,
	callbackPath: AUTH_CALLBACK_PATH,
});

const buildCallbackRouteParams = (url: string, targetReturnTo: string) => {
	try {
		return buildAuthCallbackRouteParams(url, targetReturnTo);
	} catch {
		return { returnTo: targetReturnTo };
	}
};

const isRewritableLocalhostRequest = (url: string) =>
	rewriteLocalhostUrlForAndroidEmulator(url) !== url;

export default observer(function AuthLoginRoute() {
	const router = useRouter();
	const rawParams = useLocalSearchParams() as Record<
		string,
		string | string[] | undefined
	>;
	const { loginUrl, targetReturnTo } = buildLoginFlow(rawParams);
	const callbackHandledRef = useRef(false);
	const [webViewKey, setWebViewKey] = useState(0);
	const [webViewUrl, setWebViewUrl] = useState(loginUrl);
	const [flowState, setFlowState] = useState<AuthLoginFlowState>(
		createLoginLoadingState(),
	);

	useEffect(() => {
		callbackHandledRef.current = false;
		setWebViewUrl(loginUrl);
		prepareLoginFlow(loginUrl, targetReturnTo, setFlowState);
	}, [loginUrl, targetReturnTo]);

	const onPressRetryLoginButton = () => {
		callbackHandledRef.current = false;
		setWebViewUrl(loginUrl);
		prepareLoginFlow(loginUrl, targetReturnTo, setFlowState);
		setWebViewKey((value) => value + 1);
	};

	const onLoadStartLoginWebView = () => {
		setFlowState(createLoginLoadingState());
	};

	const onLoadEndLoginWebView = () => {
		if (flowState.status !== "error") {
			prepareLoginFlow(loginUrl, targetReturnTo, setFlowState);
		}
	};

	const onErrorLoginWebView = (event: LoginWebViewErrorEvent) => {
		setFlowState(
			createLoginErrorState(
				event.nativeEvent.description || "오노라 로그인 화면 로딩에 실패했습니다.",
			),
		);
	};

	const onHandleCallbackUrl = (url: string) => {
		if (!isCallbackRequest(url)) {
			return false;
		}

		if (callbackHandledRef.current) {
			return true;
		}

		callbackHandledRef.current = true;
		mobileAuthStore.setNextPathAfterLogin(targetReturnTo);
		router.replace({
			pathname: "/auth/callback",
			params: buildCallbackRouteParams(url, targetReturnTo),
		});

		return true;
	};

	const onHandleLocalhostRedirect = (url: string) => {
		if (!isRewritableLocalhostRequest(url)) {
			return false;
		}

		setFlowState(createLoginLoadingState());
		setWebViewUrl(rewriteLocalhostUrlForAndroidEmulator(url));
		return true;
	};

	const onShouldStartLoadWithRequestLoginWebView = (
		request: LoginWebViewRequest,
	) => {
		if (onHandleCallbackUrl(request.url)) {
			return false;
		}

		return !onHandleLocalhostRedirect(request.url);
	};

	const onNavigationStateChangeLoginWebView = (navigation: LoginWebViewRequest) => {
		if (onHandleCallbackUrl(navigation.url)) {
			return;
		}

		onHandleLocalhostRedirect(navigation.url);
	};

	return (
		<View style={styles.container}>
			<View style={styles.header}>
				<Text style={styles.title}>오노라 로그인</Text>
				<Text style={styles.description}>
					예약 플랫폼 오노라(Onora) 로그인 화면입니다.
				</Text>
				<Text style={styles.description}>복귀 경로: {targetReturnTo}</Text>
			</View>

			{flowState.status === "loading" && (
				<View style={styles.loadingOverlay}>
					<ActivityIndicator color="#60a5fa" />
					<Text style={styles.message}>{flowState.message}</Text>
				</View>
			)}

			<WebView
				accessibilityLabel="auth-login-webview"
				domStorageEnabled
				javaScriptEnabled
				key={webViewKey}
				onError={onErrorLoginWebView}
				onLoadEnd={onLoadEndLoginWebView}
				onLoadStart={onLoadStartLoginWebView}
				onNavigationStateChange={onNavigationStateChangeLoginWebView}
				onShouldStartLoadWithRequest={onShouldStartLoadWithRequestLoginWebView}
				originWhitelist={["http://*", "https://*", `${AUTH_CALLBACK_SCHEME}://*`]}
				sharedCookiesEnabled
				source={{ uri: webViewUrl }}
				startInLoadingState
				style={styles.webView}
				thirdPartyCookiesEnabled
			/>

			{flowState.status === "error" && (
				<View style={styles.errorPanel}>
					<Text style={styles.errorText}>{flowState.errorMessage}</Text>
					<Button onPress={onPressRetryLoginButton} variant="secondary">
						오노라 로그인 다시 시도
					</Button>
				</View>
			)}
		</View>
	);
});

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#020617",
		flex: 1,
		paddingTop: 20,
	},
	errorPanel: {
		backgroundColor: "#111827",
		borderTopColor: "#334155",
		borderTopWidth: 1,
		gap: 12,
		padding: 16,
	},
	errorText: {
		color: "#fca5a5",
		fontSize: 14,
	},
	header: {
		gap: 8,
		paddingHorizontal: 20,
		paddingVertical: 16,
	},
	description: {
		color: "#cbd5e1",
		fontSize: 14,
	},
	loadingOverlay: {
		alignItems: "center",
		backgroundColor: "#020617",
		gap: 10,
		padding: 12,
	},
	message: {
		color: "#93c5fd",
		fontSize: 14,
	},
	title: {
		color: "#f8fafc",
		fontSize: 24,
		fontWeight: "800",
	},
	webView: {
		backgroundColor: "#ffffff",
		flex: 1,
	},
});
