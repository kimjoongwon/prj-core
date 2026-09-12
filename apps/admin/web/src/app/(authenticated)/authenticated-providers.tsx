"use client";
import { setApiNativeRefreshHandler } from "@cocrepo/api/core/client";
import { nativeRefreshToken, useVerifyToken } from "@cocrepo/api/core/auth";
import { isScopeKindAccessible } from "@cocrepo/constant";
import { useAbilityBootstrap, useTenantBootstrapFromApi } from "@cocrepo/hook";
import { useApp } from "@cocrepo/store";
import { useQuery } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { resolveAbilityBootstrapRules } from "./ability-bootstrap";

interface AuthenticatedProvidersProps {
	children: ReactNode;
}

/**
 * 인증된 라우트 그룹 전용 Provider
 *
 * 로그인 등 비인증 화면은 루트 providers만 사용하고, 이 트리에 들어오는
 * 순간부터 세션/권한/tenant bootstrap이 동작합니다.
 *
 * Provider 계층 구조:
 * NativeAuthBridge (native refresh 연결)
 * └── TenantAccessBootstrapper (권한 규칙 + navigation scope)
 *     └── AccountBootstrapper (tenant 선택 부트스트랩과 리다이렉트)
 */
export const AuthenticatedProviders = observer(
	function AuthenticatedProviders({ children }: AuthenticatedProvidersProps) {
		return (
			<NativeAuthBridge>
				<TenantAccessBootstrapper>
					<AccountBootstrapper>{children}</AccountBootstrapper>
				</TenantAccessBootstrapper>
			</NativeAuthBridge>
		);
	},
);

const NativeAuthBridge = observer(function NativeAuthBridge({
	children,
}: {
	children: ReactNode;
}) {
	const app = useApp();
	const { authSession } = app.account;

	useEffect(() => {
		const refreshNativeSession = async () => {
			if (!authSession.sessionId || !authSession.refreshToken) {
				throw new Error("Native auth session is missing.");
			}

			const response = await nativeRefreshToken({
				sessionId: authSession.sessionId,
				refreshToken: authSession.refreshToken,
			});
			const nativeAuthSession = response.data;
			if (!nativeAuthSession) {
				throw new Error("Native auth refresh response is empty.");
			}

			authSession.setNativeAuthSession(nativeAuthSession);
		};

		setApiNativeRefreshHandler(refreshNativeSession);

		return () => {
			setApiNativeRefreshHandler(null);
		};
	}, [authSession]);

	return children;
});

/**
 * TenantAccessBootstrapper
 * verify-token 1회 구독으로 accessControl 규칙과 navigation scope checker를
 * 함께 구동합니다.
 */
const TenantAccessBootstrapper = observer(function TenantAccessBootstrapper({
	children,
}: {
	children: ReactNode;
}) {
	const { abilities, isLoading, isError } = useAbilityBootstrap();
	const app = useApp();
	const account = app.account;
	const { authSession } = account;
	const accessControl = app.accessControl;
	const navigation = app.navigation;
	const shouldVerifyCurrentTenant =
		authSession.isHydrated &&
		account.isHydrated &&
		account.isSelectionResolved;
	const { data: verifyTokenResponse, isPending: isVerifyingToken } =
		useVerifyToken({
			query: {
				enabled: shouldVerifyCurrentTenant,
				queryKey: ["/api/v1/auth/verify-token", account.currentTenantId],
				retry: false,
				refetchOnWindowFocus: false,
			},
		});
	const hasFullAccess = verifyTokenResponse?.data?.hasFullAccess === true;

	useEffect(() => {
		const rules = resolveAbilityBootstrapRules({
			abilities,
			hasFullAccess,
			isAbilityLoading: isLoading,
			isAbilityError: isError,
			isTokenVerificationPending: shouldVerifyCurrentTenant && isVerifyingToken,
		});

		if (!rules) {
			return;
		}

		accessControl.updateRules(rules);
	}, [
		accessControl,
		abilities,
		hasFullAccess,
		isLoading,
		isError,
		isVerifyingToken,
		shouldVerifyCurrentTenant,
	]);

	useEffect(() => {
		navigation.setScopeChecker((scopeKind) =>
			isScopeKindAccessible(scopeKind, hasFullAccess),
		);

		return () => {
			navigation.setScopeChecker(null);
		};
	}, [hasFullAccess, navigation]);

	return children;
});

/**
 * API에서 Space 목록과 현재 account tenant 선택 정보를 부트스트랩합니다.
 */
const AccountBootstrapper = observer(function AccountBootstrapper({
	children,
}: {
	children: ReactNode;
}) {
	useTenantBootstrapFromApi();
	const app = useApp();
	const account = app.account;
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		if (
			!account.authSession.isAuthenticated ||
			!account.isSelectionResolved
		) {
			return;
		}

		if (!account.currentTenantId && pathname !== "/select-space") {
			router.replace("/select-space");
			return;
		}

		if (account.currentTenantId && pathname === "/select-space") {
			router.replace("/dashboard");
		}
	}, [
		account,
		account.currentTenantId,
		account.isSelectionResolved,
		pathname,
		router,
	]);

	return children;
});
