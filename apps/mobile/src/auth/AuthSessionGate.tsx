import { observer } from "mobx-react-lite";
import * as SplashScreen from "expo-splash-screen";
import { usePathname, useRouter } from "expo-router";
import type { Href } from "expo-router";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";
import { isAuthCallbackRoute, isAuthRoute } from "./auth-config";
import { mobileAuthStore } from "./auth-store";

const HOME_ROUTE = "/" as const;
const LOGIN_ROUTE = "/auth/login" as const;

interface AuthRedirect {
	href: Href;
	targetPathname: string;
}

const normalizePathname = (pathname?: string | null) => pathname || HOME_ROUTE;

const buildLoginRedirect = (returnTo: string): AuthRedirect => ({
	href: {
		pathname: LOGIN_ROUTE,
		params: { returnTo },
	} as unknown as Href,
	targetPathname: LOGIN_ROUTE,
});

const buildHomeRedirect = (): AuthRedirect => ({
	href: HOME_ROUTE,
	targetPathname: HOME_ROUTE,
});

const resolveAuthRedirect = (
	authStatus: "authenticated" | "unauthenticated",
	pathname: string,
): AuthRedirect | null => {
	if (isAuthCallbackRoute(pathname)) {
		return null;
	}

	if (authStatus === "authenticated" && isAuthRoute(pathname)) {
		return buildHomeRedirect();
	}

	if (authStatus === "unauthenticated" && !isAuthRoute(pathname)) {
		return buildLoginRedirect(pathname);
	}

	return null;
};

export const AuthSessionGate = observer(function AuthSessionGate({
	children,
}: {
	children: ReactNode;
}) {
	const rawPathname = usePathname();
	const router = useRouter();
	const pathname = normalizePathname(rawPathname);
	const { authStatus } = mobileAuthStore;
	const isVerifying = mobileAuthStore.isVerifying;
	const isCallbackRoute = isAuthCallbackRoute(pathname);
	const [isInitialRouteReady, setIsInitialRouteReady] = useState(false);
	const isSplashHiddenRef = useRef(false);

	useEffect(() => {
		if (
			isCallbackRoute ||
			authStatus !== "unknown" ||
			isVerifying
		) {
			return;
		}

		void mobileAuthStore.verifySession();
	}, [isCallbackRoute, authStatus, isVerifying]);

	useEffect(() => {
		if (isCallbackRoute) {
			setIsInitialRouteReady(true);
			return;
		}

		if (authStatus === "unknown" || isVerifying) {
			setIsInitialRouteReady(false);
			return;
		}

		const redirect = resolveAuthRedirect(authStatus, pathname);
		if (redirect) {
			if (redirect.targetPathname === LOGIN_ROUTE) {
				mobileAuthStore.setNextPathAfterLogin(pathname);
			}

			setIsInitialRouteReady(false);
			void router.replace(redirect.href);
			return;
		}

		setIsInitialRouteReady(true);
	}, [isCallbackRoute, authStatus, isVerifying, pathname, router]);

	const onLayoutReadyScreen = () => {
		if (!isInitialRouteReady || isSplashHiddenRef.current) {
			return;
		}

		isSplashHiddenRef.current = true;
		void SplashScreen.hideAsync().catch(() => undefined);
	};

	if (!isInitialRouteReady) {
		return null;
	}

	return (
		<View
			accessibilityLabel="auth-session-ready"
			onLayout={onLayoutReadyScreen}
			style={styles.root}
		>
			{children}
		</View>
	);
});

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
});
