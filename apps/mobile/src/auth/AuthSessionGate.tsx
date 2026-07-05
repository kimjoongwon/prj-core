import { observer } from "mobx-react-lite";
import * as SplashScreen from "expo-splash-screen";
import { usePathname, useRouter } from "expo-router";
import type { Href } from "expo-router";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { View } from "react-native";
import {
	isAuthenticatedRoute,
	isAuthRoute,
	getSpaceSelectPath,
	resolveAuthenticatedRoutePath,
} from "./auth-config";
import { mobileSession } from "./mobile-session";
import { mobileApiScope } from "./mobile-api-scope";

const HOME_ROUTE = "/" as const;
const LOGIN_ROUTE = "/auth/login" as const;
const SELECT_SPACE_ROUTE = getSpaceSelectPath();

interface AuthRedirect {
	href: Href;
	targetPathname: string;
}

interface AuthSessionGateProps {
	children: ReactNode;
}

const normalizePathname = (pathname?: string | null) => pathname || HOME_ROUTE;

const buildLoginRedirect = (returnTo: string): AuthRedirect => ({
	href: {
		pathname: LOGIN_ROUTE,
		params: { returnTo: resolveAuthenticatedRoutePath(returnTo) },
	} as unknown as Href,
	targetPathname: LOGIN_ROUTE,
});

const buildHomeRedirect = (): AuthRedirect => ({
	href: HOME_ROUTE,
	targetPathname: HOME_ROUTE,
});

const buildSpaceSelectRedirect = (returnTo: string): AuthRedirect => ({
	href: {
		pathname: SELECT_SPACE_ROUTE,
		params: { returnTo: resolveAuthenticatedRoutePath(returnTo) },
	} as unknown as Href,
	targetPathname: SELECT_SPACE_ROUTE,
});

const resolveAuthRedirect = (
	authStatus: "authenticated" | "unauthenticated",
	pathname: string,
	isSpaceSelectionResolved: boolean,
): AuthRedirect | null => {
	if (
		authStatus === "authenticated" &&
		!isSpaceSelectionResolved &&
		pathname !== SELECT_SPACE_ROUTE
	) {
		return buildSpaceSelectRedirect(pathname);
	}

	if (
		authStatus === "authenticated" &&
		isSpaceSelectionResolved &&
		pathname === SELECT_SPACE_ROUTE
	) {
		return buildHomeRedirect();
	}

	if (authStatus === "authenticated" && isAuthRoute(pathname)) {
		return buildHomeRedirect();
	}

	if (authStatus === "authenticated" && !isAuthenticatedRoute(pathname)) {
		return buildHomeRedirect();
	}

	if (authStatus === "unauthenticated" && !isAuthRoute(pathname)) {
		return buildLoginRedirect(pathname);
	}

	return null;
};

export const AuthSessionGate = observer(({
	children,
}: AuthSessionGateProps) => {
	const rawPathname = usePathname();
	const router = useRouter();
	const pathname = normalizePathname(rawPathname);
	const { authStatus } = mobileSession;
	const isVerifying = mobileSession.isVerifying;
	const isSpaceSelectionResolved =
		mobileApiScope.isSpaceSelectionResolved;
	const [isInitialRouteReady, setIsInitialRouteReady] = useState(false);
	const isSplashHiddenRef = useRef(false);

	useEffect(() => {
		if (authStatus !== "unknown" || isVerifying) {
			return;
		}

		void mobileSession.verifySession();
	}, [authStatus, isVerifying]);

	useEffect(() => {
		if (authStatus === "unknown" || isVerifying) {
			setIsInitialRouteReady(false);
			return;
		}

		const redirect = resolveAuthRedirect(
			authStatus,
			pathname,
			isSpaceSelectionResolved,
		);
		if (redirect) {
			if (redirect.targetPathname === LOGIN_ROUTE) {
				mobileSession.setNextPathAfterLogin(pathname);
			}

			setIsInitialRouteReady(false);
			void router.replace(redirect.href);
			return;
		}

		setIsInitialRouteReady(true);
	}, [authStatus, isSpaceSelectionResolved, isVerifying, pathname, router]);

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
			className="flex-1"
			onLayout={onLayoutReadyScreen}
		>
			{children}
		</View>
	);
});
