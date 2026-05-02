"use client";
import { setLoginRedirectUrl } from "@cocrepo/api/core/client";
import { useVerifyToken } from "@cocrepo/api/idp/auth";
import { setIdpLoginRedirectUrl } from "@cocrepo/api/idp/client";
import { useGetI18nCatalog } from "@cocrepo/api/idp/i18n";

import { IDP_NAV_ITEMS, isScopeKindAccessible } from "@cocrepo/constant";
import {
	ConsoleAppStoreProvider,
	convertApiToAbilityRules,
	useConsoleLocaleStore,
	useStore,
} from "@cocrepo/store";
import type { AbilityApiResponse } from "@cocrepo/type";
import { DesignSystemProvider, I18nProvider } from "@cocrepo/ui";
import {
	isServer,
	QueryClient,
	QueryClientProvider,
	useQueryClient,
} from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import { NuqsAdapter as NuqsNextAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";

interface ProvidersProps {
	children: ReactNode;
}

const AUTH_FLOW_PATH_PREFIXES = [
	"/auth",
	"/interaction",
	"/forgot-password",
	"/reset-password",
	"/error",
];

// IDP 콘솔의 로그인 리다이렉트 URL 설정 (admin용 + IDP용)
setLoginRedirectUrl("/auth/login");
setIdpLoginRedirectUrl("/auth/login");

function makeQueryClient() {
	return new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 60 * 1000,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
	if (isServer) {
		return makeQueryClient();
	}
	if (!browserQueryClient) {
		browserQueryClient = makeQueryClient();
	}
	return browserQueryClient;
}

function isAuthFlowPath(pathname?: string | null) {
	return AUTH_FLOW_PATH_PREFIXES.some(
		(prefix) => pathname === prefix || pathname?.startsWith(`${prefix}/`),
	);
}

/**
 * IDP Client 앱 최상위 Provider
 *
 * Provider 계층 구조:
 * QueryClientProvider (React Query)
 * └── NuqsAdapter (URL State)
 *     └── ConsoleAppStoreProvider (MobX Store)
 *         └── DesignSystemProvider (UI 시스템)
 */
export const Providers = observer(function Providers({
	children,
}: ProvidersProps) {
	const router = useRouter();
	const queryClient = getQueryClient();

	const handleNavigate = (path: string) => {
		router.push(path as never);
	};

	return (
		<QueryClientProvider client={queryClient}>
			<NuqsNextAdapter>
				<ConsoleAppStoreProvider>
					<LocaleI18nBootstrapper>
						<AbilityStoreBootstrapper>
							<DesignSystemProvider navigate={handleNavigate}>
								{children}
							</DesignSystemProvider>
						</AbilityStoreBootstrapper>
					</LocaleI18nBootstrapper>
				</ConsoleAppStoreProvider>
			</NuqsNextAdapter>
		</QueryClientProvider>
	);
});

const LocaleI18nBootstrapper = observer(function LocaleI18nBootstrapper({
	children,
}: {
	children: ReactNode;
}) {
	const localeStore = useConsoleLocaleStore();
	const queryClient = useQueryClient();
	const previousLanguageCodeRef = useRef(localeStore.languageCode);
	const { data } = useGetI18nCatalog(localeStore.languageCode, {
		query: {
			enabled: localeStore.isHydrated,
			staleTime: 5 * 60 * 1000,
			refetchOnWindowFocus: false,
		},
	});

	useEffect(() => {
		if (!localeStore.isHydrated) {
			return;
		}

		if (previousLanguageCodeRef.current === localeStore.languageCode) {
			return;
		}

		previousLanguageCodeRef.current = localeStore.languageCode;
		void queryClient.invalidateQueries();
	}, [localeStore.isHydrated, localeStore.languageCode, queryClient]);

	return (
		<I18nProvider
			languageCode={localeStore.languageCode}
			messages={data?.data?.messages ?? {}}
		>
			{children}
		</I18nProvider>
	);
});

const AbilityStoreBootstrapper = observer(function AbilityStoreBootstrapper({
	children,
}: {
	children: ReactNode;
}) {
	const pathname = usePathname();
	const shouldSkip = isAuthFlowPath(pathname);
	const store = useStore();
	const abilityStore = store.abilityStore;
	const navigationStore = store.navigationStore;
	const persistStore = store.persistStore;
	const shouldVerifyCurrentTenant =
		!shouldSkip &&
		persistStore?.isHydrated === true &&
		persistStore?.isSpaceSelectionResolved === true;
	const { data, isLoading, isError } = useVerifyToken({
		query: {
			enabled: shouldVerifyCurrentTenant,
			retry: false,
			refetchOnWindowFocus: false,
		},
	});
	const hasFullAccessInCurrentTenant = data?.data?.hasFullAccess === true;

	useEffect(() => {
		if (!navigationStore) {
			return;
		}

		if (shouldSkip) {
			navigationStore.setScopeChecker(null);
			return;
		}

		navigationStore.setScopeChecker((scopeKind) =>
			isScopeKindAccessible(scopeKind, hasFullAccessInCurrentTenant),
		);

		return () => {
			navigationStore.setScopeChecker(null);
		};
	}, [hasFullAccessInCurrentTenant, navigationStore, shouldSkip]);

	useEffect(() => {
		if (!abilityStore) {
			return;
		}

		if (shouldSkip) {
			abilityStore.clearRules();
			return;
		}

		if (!shouldVerifyCurrentTenant || isLoading) {
			abilityStore.clearRules();
			return;
		}

		const canAccessIdpConsole = !isError && data?.data?.valid === true;

		if (!canAccessIdpConsole) {
			abilityStore.clearRules();
			return;
		}

		const rules = convertApiToAbilityRules(
			IDP_NAV_ITEMS.filter((navItem) =>
				isScopeKindAccessible(navItem.scopeKind, hasFullAccessInCurrentTenant),
			).map(
				(navItem): AbilityApiResponse => ({
					action: "access",
					subject: navItem.subject,
					isActive: true,
					fields: undefined,
					conditions: undefined,
					inverted: false,
					reason: undefined,
				}),
			),
		);

		abilityStore.updateRules(rules);
	}, [
		abilityStore,
		data,
		hasFullAccessInCurrentTenant,
		isError,
		isLoading,
		shouldSkip,
		shouldVerifyCurrentTenant,
	]);

	return children;
});
