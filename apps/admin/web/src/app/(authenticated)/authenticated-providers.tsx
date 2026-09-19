"use client";
import { setApiNativeRefreshHandler } from "@cocrepo/api/core/client";
import { nativeRefreshToken, useVerifyToken } from "@cocrepo/api/core/auth";
import { isScopeKindAccessible } from "@cocrepo/constant";
import { useAbilityBootstrap, useTenantBootstrapFromApi } from "@cocrepo/hook";
import { useApp } from "@cocrepo/store";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
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
 * SessionBootstrap (OIDC 세션 쿠키 → 스토어 부트스트랩)
 * └── NativeAuthBridge (native refresh 연결)
 *     └── TenantAccessBootstrapper (권한 규칙 + navigation scope)
 *         └── AccountBootstrapper (tenant 선택 부트스트랩과 리다이렉트)
 */
export const AuthenticatedProviders = observer(
	function AuthenticatedProviders({ children }: AuthenticatedProvidersProps) {
		return (
			<SessionBootstrap>
				<NativeAuthBridge>
					<TenantAccessBootstrapper>
						<AccountBootstrapper>{children}</AccountBootstrapper>
					</TenantAccessBootstrapper>
				</NativeAuthBridge>
			</SessionBootstrap>
		);
	},
);

const SESSION_ID_COOKIE_NAME = "sessionId";

function readSessionIdCookie(): string | null {
	const match = document.cookie
		.split("; ")
		.find((entry) => entry.startsWith(`${SESSION_ID_COOKIE_NAME}=`));
	return match
		? decodeURIComponent(match.slice(SESSION_ID_COOKIE_NAME.length + 1))
		: null;
}

/**
 * current-space가 null이고 사용 가능한 space가 1개 이상이면 첫 번째를 자동 선택한다.
 * TenantAccessBootstrapper가 권한 확인 중에 무한 대기하는 것을 방지한다.
 */
async function autoSelectFirstSpace(accessToken: string): Promise<void> {
	try {
		const currentResponse = await fetch("/api/v1/auth/current-space", {
			headers: { Authorization: `Bearer ${accessToken}` },
			credentials: "include",
		});
		const currentBody = (await currentResponse.json()) as {
			data?: { id?: string } | null;
		};
		if (currentBody?.data?.id) {
			return;
		}

		const spacesResponse = await fetch("/api/v1/auth/my-spaces", {
			headers: { Authorization: `Bearer ${accessToken}` },
			credentials: "include",
		});
		const spacesBody = (await spacesResponse.json()) as {
			data?: Array<{ tenantId?: string }>;
		};
		const firstTenantId = spacesBody?.data?.[0]?.tenantId;
		if (!firstTenantId) {
			return;
		}

		await fetch("/api/v1/auth/current-space", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({ tenantId: firstTenantId }),
		});
	} catch {
		// 자동 선택 실패 시 /select-space 화면이 안내한다.
	}
}

/**
 * SessionBootstrap
 * OIDC 콜백은 sessionId 쿠키만 심은 채 프론트 스토어는 비어 있는 상태로 도착한다.
 * 스토어에 세션이 없고 세션 쿠키가 있으면 쿠키 기반 token/refresh로 스토어를
 * 채운다. 완료 전까지 하위 트리 렌더를 지연해 verify-token 401 → 로그인
 * 리다이렉트 루프를 방지한다.
 */
const SessionBootstrap = observer(function SessionBootstrap({
	children,
}: {
	children: ReactNode;
}) {
	const app = useApp();
	const { authSession } = app.account;
	const [isReady, setIsReady] = useState(false);

	useEffect(() => {
		let cancelled = false;

		const bootstrapFromSessionCookie = async () => {
			if (authSession.refreshToken && authSession.sessionId) {
				return;
			}
			const sessionId = readSessionIdCookie();
			if (!sessionId) {
				return;
			}
			try {
				const response = await fetch("/api/v1/auth/token/refresh", {
					method: "POST",
					credentials: "include",
				});
				const body = (await response.json()) as {
					data?: {
						accessToken?: string;
						refreshToken?: string;
						accessTokenExpiresAt?: number;
						refreshTokenExpiresAt?: number;
					};
				};
				const tokens = body?.data;
				if (response.ok && tokens?.accessToken) {
					authSession.setNativeAuthSession({
						accessToken: tokens.accessToken,
						refreshToken: tokens.refreshToken ?? "",
						sessionId,
						accessTokenExpiresAt: tokens.accessTokenExpiresAt ?? 0,
						refreshTokenExpiresAt: tokens.refreshTokenExpiresAt ?? 0,
					});

					// Space 미선택 시 첫 번째 space를 자동 선택한다 (첫 로그인 UX).
					await autoSelectFirstSpace(tokens.accessToken);
				}
			} catch {
				// 부트스트랩 실패 시 하위 verify-token 흐름이 로그인으로 안내한다.
			}
		};

		void bootstrapFromSessionCookie().finally(() => {
			if (!cancelled) {
				setIsReady(true);
			}
		});

		return () => {
			cancelled = true;
		};
	}, [authSession]);

	if (!isReady) {
		return null;
	}

	return children;
});

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
