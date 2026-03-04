"use client";

import { setIdpLoginRedirectUrl, setLoginRedirectUrl } from "@cocrepo/api";
import { ConsoleAppStoreProvider } from "@cocrepo/store";
import { DesignSystemProvider } from "@cocrepo/ui";
import {
	isServer,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";

interface ProvidersProps {
	children: ReactNode;
}

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
			<NuqsAdapter>
				<ConsoleAppStoreProvider>
					<DesignSystemProvider navigate={handleNavigate}>
						{children}
					</DesignSystemProvider>
				</ConsoleAppStoreProvider>
			</NuqsAdapter>
		</QueryClientProvider>
	);
});
