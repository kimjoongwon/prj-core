"use client";
import {
	customInstance,
	setApiNativeRefreshHandler,
} from "@cocrepo/api/core/client";
import { nativeRefreshToken, useVerifyToken } from "@cocrepo/api/idp/auth";
import { setIdpNativeRefreshHandler } from "@cocrepo/api/idp/client";
import { isScopeKindAccessible } from "@cocrepo/constant";
import { useAbilityBootstrap, useSpaceBootstrapFromApi } from "@cocrepo/hook";

import { DesignSystemProvider, I18nProvider } from "@cocrepo/ui";
import {
	isServer,
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { NuqsAdapter as NuqsNextAdapter } from "nuqs/adapters/next/app";
import { type ReactNode, useEffect } from "react";
import { AppProvider, useApp } from "@/stores";
import { resolveAbilityBootstrapRules } from "./ability-bootstrap";

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

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
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
 * └── AppProvider (AppStore 통합 관리)
 *     └── AbilityBootstrapper (서버 권한 -> ability 반영)
 *         └── DesignSystemProvider (UI 시스템)
 */
export const Providers = observer(function Providers({
	children,
}: ProvidersProps) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<NuqsNextAdapter>
				<AppProvider>
					<NativeAuthBridge>
						<I18nCatalogBootstrapper>
							<AbilityBootstrapper>
								<DesignSystemProvider>
									<SpaceBootstrapper>
										<NavigationScopeBootstrapper>
											{children}
										</NavigationScopeBootstrapper>
									</SpaceBootstrapper>
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
	const space = app.space;

	useEffect(() => {
		const refreshNativeSession = async () => {
			if (!space.sessionId || !space.refreshToken) {
				throw new Error("Native auth session is missing.");
			}

			const response = await nativeRefreshToken({
				sessionId: space.sessionId,
				refreshToken: space.refreshToken,
			});
			const session = response.data;
			if (!session) {
				throw new Error("Native auth refresh response is empty.");
			}

			space.setNativeAuthSession(session);
		};

		setApiNativeRefreshHandler(refreshNativeSession);
		setIdpNativeRefreshHandler(refreshNativeSession);

		return () => {
			setApiNativeRefreshHandler(null);
			setIdpNativeRefreshHandler(null);
		};
	}, [space]);

	return children;
});

const I18nCatalogBootstrapper = observer(function I18nCatalogBootstrapper({
	children,
}: {
	children: ReactNode;
}) {
	const app = useApp();
	const locale = app.locale;
	const languageCode = locale.languageCode;
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

	useEffect(() => {
		document.documentElement.lang = locale.htmlLang;
	}, [locale.htmlLang]);

	return (
		<I18nProvider languageCode={languageCode} messages={messages}>
			{children}
		</I18nProvider>
	);
});

/**
 * AbilityBootstrapper
 * 서버에서 권한을 로드하여 ability 규칙으로 반영합니다.
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
	const space = app.space;
	const ability = app.ability;
	const shouldVerifyCurrentTenant =
		!isAbilitiesDisabled && space.isHydrated && space.isSpaceSelectionResolved;
	const { data: verifyTokenResponse, isPending: isVerifyingToken } =
		useVerifyToken({
			query: {
				enabled: shouldVerifyCurrentTenant,
				queryKey: ["/api/v1/auth/verify-token", space.tenantId],
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

		ability.updateRules(rules);
	}, [
		ability,
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
 * API에서 Space 목록과 현재 Space 정보를 부트스트랩합니다.
 */
const SpaceBootstrapper = observer(function SpaceBootstrapper({
	children,
}: {
	children: ReactNode;
}) {
	useSpaceBootstrapFromApi();

	return children;
});

/**
 * 현재 tenant 권한 기준을 Navigation의 scope checker에 연결합니다.
 */
const NavigationScopeBootstrapper = observer(
	function NavigationScopeBootstrapper({ children }: { children: ReactNode }) {
		const app = useApp();
		const space = app.space;
		const navigation = app.navigation;
		const shouldVerifyCurrentTenant =
			space.isHydrated && space.isSpaceSelectionResolved;
		const { data: verifyTokenResponse } = useVerifyToken({
			query: {
				enabled: shouldVerifyCurrentTenant,
				queryKey: ["/api/v1/auth/verify-token", space.tenantId],
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
