"use client";

import { customIdpFetch } from "@cocrepo/api/idp/client";
import { DEFAULT_LANGUAGE, type LanguageCode } from "@cocrepo/constant";
import { DesignSystemProvider, I18nProvider } from "@cocrepo/ui";
import {
	QueryClient,
	QueryClientProvider,
	useQuery,
} from "@tanstack/react-query";
import { type ReactNode, useState } from "react";

type I18nCatalogResponse = {
	data?: { messages?: Record<string, string> };
};

/**
 * 로그인 UI 전용 프로바이더 스택
 * - 콘솔 스토어/세션 게이트 없음 (콘솔은 admin-web 소유)
 * - i18n 카탈로그는 발급자 API(/api/v1/i18n/catalog)에서 기본 언어 기준으로만 로드
 */
export function Providers({ children }: { children: ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: { retry: 1, refetchOnWindowFocus: false },
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<DesignSystemProvider>
				<I18nCatalogBootstrapper>{children}</I18nCatalogBootstrapper>
			</DesignSystemProvider>
		</QueryClientProvider>
	);
}

function I18nCatalogBootstrapper({ children }: { children: ReactNode }) {
	const [languageCode] = useState<LanguageCode>(DEFAULT_LANGUAGE);
	const { data } = useQuery({
		queryKey: ["idp-i18n-catalog", languageCode],
		queryFn: () =>
			customIdpFetch<I18nCatalogResponse>(
				`/api/v1/i18n/catalog/${languageCode}`,
				{
					method: "GET",
				},
			),
		retry: false,
		refetchOnWindowFocus: false,
	});

	return (
		<I18nProvider
			languageCode={languageCode}
			messages={data?.data?.messages ?? {}}
		>
			{children}
		</I18nProvider>
	);
}
