import { ScreenFrame } from "@cocrepo/mo-ui";
import { useLocalSearchParams, useRouter } from "expo-router";
import type { Href } from "expo-router";
import { observer } from "mobx-react-lite";
import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
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
const AUTH_API_LOGIN_PATH = "/api/v1/auth/login";
const AUTH_WEB_LOGIN_PATH = "/auth/login";
const OIDC_AUTH_PATH = "/oidc/auth";
const LoginWebView = WebView as unknown as ComponentType<WebViewProps>;
const WEB_VIEW_STYLE = {
	backgroundColor: "#ffffff",
	flex: 1,
} as const;

interface LoginWebViewRequest {
	url: string;
}

interface LoginWebViewError {
	nativeEvent: {
		url?: string;
	};
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

const normalizeUrlPathname = (pathname: string) =>
	pathname.replace(/\/+$/, "") || "/";

const isNotMobileClient = (clientId: string | null) =>
	!clientId || clientId !== AUTH_CLIENT_ID;

const isLoginFlowDriftRequest = (url: string) => {
	try {
		const parsed = new URL(url, "http://localhost");
		const pathname = normalizeUrlPathname(parsed.pathname);

		if (pathname === AUTH_WEB_LOGIN_PATH) {
			return true;
		}

		if (pathname === AUTH_API_LOGIN_PATH) {
			return isNotMobileClient(parsed.searchParams.get("clientId"));
		}

		if (pathname === OIDC_AUTH_PATH) {
			return isNotMobileClient(parsed.searchParams.get("client_id"));
		}

		return false;
	} catch {
		return false;
	}
};

const buildCallbackRouteParams = (url: string, targetReturnTo: string) => {
	try {
		return buildAuthCallbackRouteParams(url, targetReturnTo);
	} catch {
		return { returnTo: targetReturnTo };
	}
};

const AuthLoginRoute = observer(() => {
	const router = useRouter();
	const rawParams = useLocalSearchParams() as Record<
		string,
		string | string[] | undefined
	>;
	const { loginUrl, targetReturnTo } = buildLoginFlow(rawParams);
	const callbackHandledRef = useRef(false);
	const [webViewUrl, setWebViewUrl] = useState(loginUrl);
	const [webViewResetKey, setWebViewResetKey] = useState(0);

	useEffect(() => {
		callbackHandledRef.current = false;
		mobileAuthStore.setNextPathAfterLogin(targetReturnTo);
		setWebViewUrl(loginUrl);
		setWebViewResetKey((current) => current + 1);
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

	const onRestartLoginFlow = () => {
		callbackHandledRef.current = false;
		mobileAuthStore.setNextPathAfterLogin(targetReturnTo);
		setWebViewUrl(loginUrl);
		setWebViewResetKey((current) => current + 1);
	};

	const onHandleLoginFlowDrift = (url: string) => {
		if (!isLoginFlowDriftRequest(url)) {
			return false;
		}

		onRestartLoginFlow();
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

		if (onHandleLoginFlowDrift(request.url)) {
			return false;
		}

		return !onHandleLocalhostRedirect(request.url);
	};

	const onNavigationStateChangeLoginWebView = (navigation: LoginWebViewRequest) => {
		if (onHandleCallbackUrl(navigation.url)) {
			return;
		}

		if (onHandleLoginFlowDrift(navigation.url)) {
			return;
		}

		onHandleLocalhostRedirect(navigation.url);
	};

	const onErrorLoginWebView = (event: LoginWebViewError) => {
		const failedUrl = event.nativeEvent.url;
		if (failedUrl) {
			if (onHandleLoginFlowDrift(failedUrl)) {
				return;
			}

			onHandleLocalhostRedirect(failedUrl);
		}
	};

	return (
		<ScreenFrame
			className="bg-white"
			contentClassName="flex-1 bg-white"
			edges={[]}
		>
			<LoginWebView
				accessibilityLabel="auth-login-webview"
				domStorageEnabled
				javaScriptEnabled
				key={webViewResetKey}
				onError={onErrorLoginWebView}
				onNavigationStateChange={onNavigationStateChangeLoginWebView}
				onShouldStartLoadWithRequest={onShouldStartLoadWithRequestLoginWebView}
				originWhitelist={["http://*", "https://*", `${AUTH_CALLBACK_SCHEME}://*`]}
				sharedCookiesEnabled
				source={{ uri: webViewUrl }}
				startInLoadingState
				style={WEB_VIEW_STYLE}
				thirdPartyCookiesEnabled
			/>
		</ScreenFrame>
	);
});

export default AuthLoginRoute;
