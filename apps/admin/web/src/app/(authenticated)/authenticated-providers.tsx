"use client";
import {
	installCoreSessionRecovery,
	refreshSessionTokens,
} from "@cocrepo/api/core/client";
import { useVerifyToken } from "@cocrepo/api/idp/auth";
import { isScopeKindAccessible, Token } from "@cocrepo/constant";
import { useAbilityBootstrap, useTenantBootstrapFromApi } from "@cocrepo/hook";
import { type AuthSession, useApp } from "@cocrepo/store";
import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { resolveAbilityBootstrapRules } from "./ability-bootstrap";

interface AuthenticatedProvidersProps {
	children: ReactNode;
}

// window.location.href는 origin 전체 경로를 쓴다(admin web은 basePath "/admin").
const ADMIN_WEB_LOGIN_PATH = "/admin/auth/login";

/**
 * 인증 세션을 소유한 앱만 세션 복구 정책을 설치한다.
 * 401이 나면 쿠키 기반 token/refresh로 갱신 후 재시도하고, 갱신이 실패하면
 * 로그인 화면으로 보낸다. 로그인 UI(idp/web)는 이 정책을 설치하지 않는다.
 */
function installAdminSessionRecovery(authSession: AuthSession) {
	installCoreSessionRecovery({
		refreshSession: async () => {
			// 세션 표시(loggedIn)가 없는 방문자는 인증 쿠키도 없다는 뜻이므로
			// 갱신 요청을 만들지 않고 만료로 본다.
			if (!readSessionPresenceMarker()) {
				throw new Error("No session presence marker cookie.");
			}

			const refreshed = await refreshSessionTokens();
			if (!refreshed) {
				throw new Error("Session token refresh failed.");
			}
		},
		onSessionExpired: () => {
			// 의도적 로그아웃 중에는 만료 리다이렉트를 하지 않는다. 로그아웃
			// API가 쿠키를 지운 직후 살아 있던 요청들의 401이 이 핸들러를
			// 발동시키는데, 여기서 로그인 화면으로 보내면 로그아웃 버튼의
			// OP end_session 이동이 대체되어 OP 세션이 남는다(로그인 화면이
			// SSO 자동 재개로 곧바로 대시보드로 되돌려보낸다).
			if (authSession.isLoggingOut) {
				return;
			}
			window.location.href = ADMIN_WEB_LOGIN_PATH;
		},
	});
}

/**
 * 인증된 라우트 그룹 전용 Provider
 *
 * 로그인 등 비인증 화면은 루트 providers만 사용하고, 이 트리에 들어오는
 * 순간부터 세션/권한/tenant bootstrap이 동작합니다.
 *
 * Provider 계층 구조:
 * SessionBootstrap (OIDC 세션 쿠키 → 스토어 부트스트랩)
 * └── TenantAccessBootstrapper (권한 규칙 + navigation scope)
 *     └── AccountBootstrapper (tenant 선택 부트스트랩과 리다이렉트)
 */
export const AuthenticatedProviders = observer(
	function AuthenticatedProviders({ children }: AuthenticatedProvidersProps) {
		return (
			<SessionBootstrap>
				<TenantAccessBootstrapper>
					<AccountBootstrapper>{children}</AccountBootstrapper>
				</TenantAccessBootstrapper>
			</SessionBootstrap>
		);
	},
);

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
 * 세션 존재 표시(loggedIn) 쿠키는 민감하지 않아 클라이언트가 읽을 수 있다.
 * 표시가 없는 방문자는 인증 쿠키도 없다는 뜻이므로 갱신 요청(401)을 만들지
 * 않고 바로 로그인 화면으로 보낸다.
 */
function readSessionPresenceMarker(): boolean {
	return document.cookie
		.split("; ")
		.some((entry) => entry === `${Token.LOGGED_IN}=1`);
}

/**
 * SessionBootstrap
 * OIDC 콜백은 HttpOnly 세션 쿠키(accessToken/refreshToken/sessionId)만 심은 채
 * 프론트 스토어는 비어 있는 상태로 도착한다. document.cookie로는 HttpOnly 쿠키를
 * 읽을 수 없으므로 공용 token/refresh(단일 비행)를 호출해 회전된 토큰과
 * sessionId로 스토어를 채운다. 세션 표시가 없거나 갱신에 실패하면 로그인 화면으로
 * 보내고 하위 트리는 렌더하지 않는다(비인증 API 호출이 401 콘솔을 오염시키지
 * 않도록).
 */
const SessionBootstrap = observer(function SessionBootstrap({
	children,
}: {
	children: ReactNode;
}) {
	const app = useApp();
	const { authSession } = app.account;
	const router = useRouter();
	const [shouldRenderChildren, setShouldRenderChildren] = useState(false);

	useEffect(() => {
		let cancelled = false;

		installAdminSessionRecovery(authSession);

		const bootstrapFromSessionCookies = async (): Promise<boolean> => {
			if (authSession.refreshToken && authSession.sessionId) {
				return true;
			}
			if (!readSessionPresenceMarker()) {
				router.replace("/auth/login");
				return false;
			}

			const refreshed = await refreshSessionTokens();
			if (!refreshed) {
				router.replace("/auth/login");
				return false;
			}

			// Space 미선택 시 첫 번째 space를 자동 선택한다 (첫 로그인 UX).
			await autoSelectFirstSpace(authSession.accessToken ?? "");
			return true;
		};

		void bootstrapFromSessionCookies().then((shouldRender) => {
			if (!cancelled && shouldRender) {
				setShouldRenderChildren(true);
			}
		});

		return () => {
			cancelled = true;
		};
	}, [authSession, router]);

	if (!shouldRenderChildren) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-background">
				<Spinner size="lg" />
			</div>
		);
	}

	return <>{children}</>;
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
	// 로그아웃 시 account.clear()로 스토어가 비며 쿼리 키가 바뀌는데, 세션 토큰이
	// 없으면 verify-token 재실행이 401/refresh 401 콘솔 노이즈를 만든다. 토큰이
	// 남아 있는 동안에만 검증을 활성화한다.
	const shouldVerifyCurrentTenant =
		authSession.isHydrated &&
		Boolean(authSession.refreshToken) &&
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
