"use client";
import {
	customInstance,
	setApiNativeRefreshHandler,
} from "@cocrepo/api/core/client";
import { nativeRefreshToken, useVerifyToken } from "@cocrepo/api/core/auth";
import { ADMIN_NAV_ITEMS, isScopeKindAccessible } from "@cocrepo/constant";
import { useAbilityBootstrap, useTenantBootstrapFromApi } from "@cocrepo/hook";
import { AppProvider, useApp } from "@cocrepo/store";
import type { AppProviderConfig } from "@cocrepo/type";

import { DesignSystemProvider, I18nProvider } from "@cocrepo/ui";
import {
	isServer,
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import { NuqsAdapter as NuqsNextAdapter } from "nuqs/adapters/next/app";
import { type ReactNode, useEffect } from "react";
import { resolveAbilityBootstrapRules } from "./ability-bootstrap";
import {
	deserializeQueryCacheData,
	serializeQueryCacheData,
} from "./query-cache-serializer";

interface ProvidersProps {
	children: ReactNode;
}

interface I18nCatalogData {
	languageCode: string;
	messages: Record<string, string>;
}

interface ApiResponse<T> {
	data?: T;
}

const ADMIN_APP_CONFIG = {
	appName: "ADMIN",
	navItems: ADMIN_NAV_ITEMS,
	persistStorageKey: "admin-persist",
} satisfies AppProviderConfig;

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			dehydrate: {
				serializeData: serializeQueryCacheData,
			},
			hydrate: {
				deserializeData: deserializeQueryCacheData,
			},
			queries: {
				// SSR 환경에서 클라이언트 즉시 refetch 방지를 위한 staleTime 설정
				staleTime: 60 * 1000,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
	if (isServer) {
		// 서버: 항상 새로운 QueryClient 생성
		return makeQueryClient();
	}
	// 브라우저: 기존 클라이언트 재사용 (React Suspense 대응)
	if (!browserQueryClient) {
		browserQueryClient = makeQueryClient();
	}
	return browserQueryClient;
}

/**
 * Admin 앱 최상위 Provider
 *
 * Provider 계층 구조:
 * QueryClientProvider
 * └── AppProvider (ADMIN 앱 상태와 런타임 연결)
 *     └── AbilityBootstrapper (서버 권한 -> accessControl 반영)
 *         └── DesignSystemProvider (UI 시스템)
 */
export const Providers = observer(function Providers({
	children,
}: ProvidersProps) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<NuqsNextAdapter>
				<AppProvider config={ADMIN_APP_CONFIG}>
					<NativeAuthBridge>
						<I18nCatalogBootstrapper>
							<AbilityBootstrapper>
								<DesignSystemProvider>
									<AccountBootstrapper>
										<NavigationScopeBootstrapper>
											{children}
										</NavigationScopeBootstrapper>
									</AccountBootstrapper>
								</DesignSystemProvider>
							</AbilityBootstrapper>
						</I18nCatalogBootstrapper>
					</NativeAuthBridge>
				</AppProvider>
			</NuqsNextAdapter>
		</QueryClientProvider>
	);
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

const I18nCatalogBootstrapper = observer(function I18nCatalogBootstrapper({
	children,
}: {
	children: ReactNode;
}) {
	const app = useApp();
	const language = app.language;
	const languageCode = language.languageCode;
	const { data } = useQuery({
		queryKey: ["core-i18n-catalog", languageCode],
		queryFn: () =>
			customInstance<ApiResponse<I18nCatalogData>>({
				method: "GET",
				url: `/api/v1/i18n/catalog/${languageCode}`,
			}),
		retry: false,
		refetchOnWindowFocus: false,
	});
	const messages = data?.data?.messages ?? {};

	return (
		<I18nProvider languageCode={languageCode} messages={messages}>
			{children}
		</I18nProvider>
	);
});

/**
 * AbilityBootstrapper
 * 서버에서 권한을 로드하여 accessControl 규칙으로 반영합니다.
 */
const AbilityBootstrapper = observer(function AbilityBootstrapper({
	children,
}: {
	children: ReactNode;
}) {
	const {
		abilities,
		isLoading,
		isError,
		isDisabled: isAbilitiesDisabled,
	} = useAbilityBootstrap();
	const app = useApp();
	const account = app.account;
	const { authSession } = account;
	const accessControl = app.accessControl;
	const shouldVerifyCurrentTenant =
		!isAbilitiesDisabled &&
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
			!account.isSelectionResolved ||
			pathname.startsWith("/auth/")
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

/**
 * 현재 account tenant 권한 기준을 Navigation의 scope checker에 연결합니다.
 */
const NavigationScopeBootstrapper = observer(
	function NavigationScopeBootstrapper({ children }: { children: ReactNode }) {
		const app = useApp();
		const account = app.account;
		const { authSession } = account;
		const navigation = app.navigation;
		const shouldVerifyCurrentTenant =
			authSession.isHydrated &&
			account.isHydrated &&
			account.isSelectionResolved;
		const { data: verifyTokenResponse } = useVerifyToken({
			query: {
				enabled: shouldVerifyCurrentTenant,
				queryKey: ["/api/v1/auth/verify-token", account.currentTenantId],
				retry: false,
				refetchOnWindowFocus: false,
			},
		});
		const hasFullAccessInCurrentTenant =
			verifyTokenResponse?.data?.hasFullAccess === true;

		useEffect(() => {
			navigation.setScopeChecker((scopeKind) =>
				isScopeKindAccessible(scopeKind, hasFullAccessInCurrentTenant),
			);

			return () => {
				navigation.setScopeChecker(null);
			};
		}, [hasFullAccessInCurrentTenant, navigation]);

		return children;
	},
);
