"use client";
import { useGetI18nCatalog } from "@cocrepo/api/core/i18n";
import { useVerifyToken } from "@cocrepo/api/idp/auth";

import { useStore } from "@cocrepo/store";
import { DesignSystemProvider, I18nProvider } from "@cocrepo/ui";
import {
	isServer,
	QueryClient,
	QueryClientProvider,
	useQueryClient,
} from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { NuqsAdapter as NuqsNextAdapter } from "nuqs/adapters/next/app";
import { type ReactNode, useEffect, useRef } from "react";
import { useAbilities } from "@/hooks";
import { AppStoreProvider, useLocaleStore, usePersistStore } from "@/stores";
import { resolveAbilityBootstrapRules } from "./ability-bootstrap";

interface ProvidersProps {
	children: ReactNode;
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
 * └── AppStoreProvider (RootStore + 주입된 Store들 통합 관리)
 *     └── AbilityStoreBootstrapper (서버 권한 -> AbilityStore 반영)
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
				<AppStoreProvider>
					<LocaleI18nBootstrapper>
						<AbilityStoreBootstrapper>
							<DesignSystemProvider navigate={handleNavigate}>
								{children}
							</DesignSystemProvider>
						</AbilityStoreBootstrapper>
					</LocaleI18nBootstrapper>
				</AppStoreProvider>
			</NuqsNextAdapter>
		</QueryClientProvider>
	);
});

const LocaleI18nBootstrapper = observer(function LocaleI18nBootstrapper({
	children,
}: {
	children: ReactNode;
}) {
	const localeStore = useLocaleStore();
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

/**
 * AbilityStoreBootstrapper
 * 서버에서 권한을 로드하여 AbilityStore 규칙으로 반영합니다.
 */
const AbilityStoreBootstrapper = observer(function AbilityStoreBootstrapper({
	children,
}: {
	children: ReactNode;
}) {
	const {
		abilities,
		isLoading,
		isError,
		isDisabled: isAbilitiesDisabled,
	} = useAbilities();
	const persistStore = usePersistStore();
	const store = useStore();
	const abilityStore = store.abilityStore;
	const shouldVerifyCurrentTenant =
		!isAbilitiesDisabled &&
		persistStore.isHydrated &&
		persistStore.isSpaceSelectionResolved;
	const { data: verifyTokenResponse, isPending: isVerifyingToken } =
		useVerifyToken({
			query: {
				enabled: shouldVerifyCurrentTenant,
				queryKey: ["/api/v1/auth/verify-token", persistStore.spaceId],
				retry: false,
				refetchOnWindowFocus: false,
			},
		});
	const hasFullAccess = verifyTokenResponse?.data?.hasFullAccess === true;

	useEffect(() => {
		if (!abilityStore) {
			return;
		}

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

		abilityStore.updateRules(rules);
	}, [
		abilityStore,
		abilities,
		hasFullAccess,
		isLoading,
		isError,
		isVerifyingToken,
		shouldVerifyCurrentTenant,
	]);

	return children;
});
