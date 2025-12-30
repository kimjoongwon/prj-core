"use client";

import { DesignSystemProvider } from "@cocrepo/design-system";
import { AbilityProvider } from "@cocrepo/hook";
import {
	isServer,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type ReactNode } from "react";
import { AdminStoreProvider } from "../src/stores";

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
 * └── AbilityProvider (권한 관리)
 *     └── AdminStoreProvider (RootStore + 주입된 Store들 통합 관리)
 *         └── DesignSystemProvider (UI 시스템)
 */
export function Providers({ children }: ProvidersProps) {
	const router = useRouter();
	const queryClient = getQueryClient();

	const handleNavigate = (path: string) => {
		router.push(path as never);
	};

	return (
		<QueryClientProvider client={queryClient}>
			<AbilityProvider>
				<AdminStoreProvider>
					<DesignSystemProvider navigate={handleNavigate}>
						{children}
					</DesignSystemProvider>
				</AdminStoreProvider>
			</AbilityProvider>
		</QueryClientProvider>
	);
}
