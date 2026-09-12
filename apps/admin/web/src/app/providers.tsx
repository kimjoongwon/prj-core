"use client";
import { customInstance } from "@cocrepo/api/core/client";
import { ADMIN_NAV_ITEMS } from "@cocrepo/constant";
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
import { NuqsAdapter as NuqsNextAdapter } from "nuqs/adapters/next/app";
import { type ReactNode } from "react";
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
 * 로그인 화면을 포함한 모든 라우트가 사용하는 기반만 담습니다.
 * 인증이 필요한 bootstrap은 (authenticated) 그룹 layout이 소유합니다.
 *
 * Provider 계층 구조:
 * QueryClientProvider
 * └── AppProvider (ADMIN 앱 상태와 런타임 연결)
 *     └── I18nCatalogBootstrapper (언어별 번역 catalog)
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
					<I18nCatalogBootstrapper>
						<DesignSystemProvider>{children}</DesignSystemProvider>
					</I18nCatalogBootstrapper>
				</AppProvider>
			</NuqsNextAdapter>
		</QueryClientProvider>
	);
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
