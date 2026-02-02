"use client";

import type { AbilityResponseDto } from "@cocrepo/api";
import { DesignSystemProvider } from "@cocrepo/design-system";
import {
	type AbilityActions,
	AbilityProvider,
	type AbilityRule,
} from "@cocrepo/hook";
import {
	isServer,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useAbilities } from "@/hooks";
import { AppStoreProvider } from "@/stores";

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
 * └── AbilityProviderWrapper (서버에서 권한 로드)
 *     └── AppStoreProvider (RootStore + 주입된 Store들 통합 관리)
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
			<NuqsAdapter>
				<AbilityProviderWrapper>
					<AppStoreProvider>
						<DesignSystemProvider navigate={handleNavigate}>
							{children}
						</DesignSystemProvider>
					</AppStoreProvider>
				</AbilityProviderWrapper>
			</NuqsAdapter>
		</QueryClientProvider>
	);
}

/**
 * AbilityProviderWrapper
 * 서버에서 권한을 로드하여 AbilityProvider에 전달합니다.
 */
function AbilityProviderWrapper({ children }: { children: ReactNode }) {
	const { abilities, isLoading, isError } = useAbilities();

	// API 응답을 AbilityRule 형식으로 변환
	// action.name을 대문자로 변환 (API: "manage" → 코드: "MANAGE")
	const rules: AbilityRule[] | undefined = abilities?.map(
		(ability: AbilityResponseDto) => ({
			action: (
				ability.action as { name?: string }
			)?.name?.toUpperCase() as AbilityActions,
			subject: ability.subject?.name ?? "",
			conditions: ability.conditions as Record<string, unknown> | undefined,
			inverted: !ability.isActive, // isActive가 false면 권한 거부
		}),
	);

	// API 로딩 중이거나 에러이거나 빈 배열일 때 기본 규칙 사용 (MANAGE all - 전체 권한)
	// TODO: API 정상화 후 이 fallback 로직 제거
	const effectiveRules =
		isLoading || isError || !rules || rules.length === 0 ? undefined : rules;

	return <AbilityProvider rules={effectiveRules}>{children}</AbilityProvider>;
}
