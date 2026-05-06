import { ScreenFrame } from "@cocrepo/mo-ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { Href } from "expo-router";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { StyleSheet } from "react-native";
import { WebView, type WebViewProps } from "react-native-webview";
import {
	getAuthenticatedHomePath,
	resolveAuthenticatedRoutePath,
} from "@/auth/auth-config";
import { mobileAuthStore } from "@/auth/auth-store";
import {
	buildAuthCallbackRouteParams,
	buildAuthLoginUrl,
	isAuthCallbackUrl,
	parseAuthLoginParams,
	rewriteLocalhostUrlForAndroidEmulator,
} from "@/auth/_utils/auth";

const AUTH_CLIENT_ID = "user-mobile";
const AUTH_CALLBACK_SCHEME = "kr.co.cocdev.onoramobile";
const AUTH_CALLBACK_PATH = "auth/callback";
const LoginWebView = WebView as unknown as ComponentType<WebViewProps>;

interface LoginWebViewRequest {
	url: string;
}

const buildLoginFlow = (
	params: Record<string, string | string[] | undefined>,
) => {
	const parsed = parseAuthLoginParams(params);
	const targetReturnTo = resolveAuthenticatedRoutePath(
		parsed.returnTo || getAuthenticatedHomePath(),
	);
	const loginUrl = rewriteLocalhostUrlForAndroidEmulator(
		buildAuthLoginUrl({
			clientId: AUTH_CLIENT_ID,
			targetReturnTo,
			callbackScheme: AUTH_CALLBACK_SCHEME,
			callbackPath: AUTH_CALLBACK_PATH,
		}),
	);

	return { loginUrl, targetReturnTo };
};

const isCallbackRequest = (url: string) =>
	isAuthCallbackUrl(url, {
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

export default observer(function AuthLoginRoute() {
	const router = useRouter();
	const rawParams = useLocalSearchParams() as Record<
		string,
		string | string[] | undefined
	>;
	const { loginUrl, targetReturnTo } = buildLoginFlow(rawParams);
	const callbackHandledRef = useRef(false);
	const [webViewUrl, setWebViewUrl] = useState(loginUrl);

	useEffect(() => {
		callbackHandledRef.current = false;
		mobileAuthStore.setNextPathAfterLogin(targetReturnTo);
		setWebViewUrl(loginUrl);
	}, [loginUrl, targetReturnTo]);

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
		} as Href);

		return true;
	};

	const onHandleLocalhostRedirect = (url: string) => {
		const rewrittenUrl = rewriteLocalhostUrlForAndroidEmulator(url);
		if (rewrittenUrl === url) {
			return false;
		}

		setWebViewUrl(rewrittenUrl);
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
		<ScreenFrame
			backgroundColor="#ffffff"
			contentStyle={styles.container}
			edges={[]}
		>
			<LoginWebView
				accessibilityLabel="auth-login-webview"
				domStorageEnabled
				javaScriptEnabled
				onNavigationStateChange={onNavigationStateChangeLoginWebView}
				onShouldStartLoadWithRequest={onShouldStartLoadWithRequestLoginWebView}
				originWhitelist={["http://*", "https://*", `${AUTH_CALLBACK_SCHEME}://*`]}
				sharedCookiesEnabled
				source={{ uri: webViewUrl }}
				startInLoadingState
				style={styles.webView}
				thirdPartyCookiesEnabled
			/>
		</ScreenFrame>
	);
});

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#ffffff",
		flex: 1,
	},
	webView: {
		backgroundColor: "#ffffff",
		flex: 1,
	},
});
