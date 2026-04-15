"use client";
import { type AbilityResponseDto } from "@cocrepo/api/core/abilities";

import { convertApiToAbilityRules, useStore } from "@cocrepo/store";
import type { AbilityApiResponse } from "@cocrepo/type";
import { NuqsNextAdapter } from "@cocrepo/hook/nuqs";
import { DesignSystemProvider } from "@cocrepo/ui";
import {
	isServer,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
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
					<AbilityStoreBootstrapper>
						<DesignSystemProvider navigate={handleNavigate}>
							{children}
						</DesignSystemProvider>
					</AbilityStoreBootstrapper>
				</AppStoreProvider>
			</NuqsNextAdapter>
		</QueryClientProvider>
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
	const { abilities, isLoading, isError } = useAbilities();
	const store = useStore();
	const abilityStore = store.abilityStore;

	useEffect(() => {
		if (!abilityStore) {
			return;
		}

		if (isLoading) {
			return;
		}

		if (isError || !abilities || abilities.length === 0) {
			abilityStore.updateRules([]);
			return;
		}

		const apiResponses: AbilityApiResponse[] = abilities.map(
			(ability: AbilityResponseDto) => ({
				action: ability.action?.name,
				subject: ability.subject?.name,
				fields: ability.fields,
				conditions:
					(ability.conditions as Record<string, unknown> | null | undefined) ??
					undefined,
				inverted: ability.inverted,
				reason: ability.reason ?? undefined,
			}),
		);

		abilityStore.updateRules(convertApiToAbilityRules(apiResponses));
	}, [abilityStore, abilities, isLoading, isError]);

	return children;
});
