"use client";
import { setLoginRedirectUrl } from "@cocrepo/api/core/client";
import { useGetMySpaces } from "@cocrepo/api/idp/auth";
import { setIdpLoginRedirectUrl } from "@cocrepo/api/idp/client";

import { IDP_SUBJECTS } from "@cocrepo/constant";
import {
	ConsoleAppStoreProvider,
	convertApiToAbilityRules,
	useStore,
} from "@cocrepo/store";
import type { AbilityApiResponse } from "@cocrepo/type";
import { NuqsNextAdapter } from "@cocrepo/hook/nuqs";
import { DesignSystemProvider } from "@cocrepo/ui";
import {
	isServer,
	QueryClient,
	QueryClientProvider,
} from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

interface ProvidersProps {
	children: ReactNode;
}

const SYSTEM_SPACE_ID = "61ddca20-1752-466e-b4da-879ebdbe54e3";
const AUTH_FLOW_PATH_PREFIXES = [
	"/auth",
	"/interaction",
	"/forgot-password",
	"/reset-password",
	"/error",
];

const IDP_MENU_RULES = convertApiToAbilityRules(
	Object.values(IDP_SUBJECTS).map(
		(subject): AbilityApiResponse => ({
			action: "access",
			subject,
			isActive: true,
			fields: undefined,
			conditions: undefined,
			inverted: false,
			reason: undefined,
		}),
	),
);

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
	return AUTH_FLOW_PATH_PREFIXES.some((prefix) => pathname?.startsWith(prefix));
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
					<AbilityStoreBootstrapper>
						<DesignSystemProvider navigate={handleNavigate}>
							{children}
						</DesignSystemProvider>
					</AbilityStoreBootstrapper>
				</ConsoleAppStoreProvider>
			</NuqsNextAdapter>
		</QueryClientProvider>
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
	const { data, isLoading, isError } = useGetMySpaces({
		query: {
			enabled: !shouldSkip,
			retry: false,
			refetchOnWindowFocus: false,
		},
	});

	useEffect(() => {
		if (!abilityStore) {
			return;
		}

		if (shouldSkip) {
			abilityStore.clearRules();
			return;
		}

		if (isLoading) {
			return;
		}

		const spaces = data?.data ?? [];
		const canAccessIdpConsole =
			!isError && spaces.some((space) => space.id === SYSTEM_SPACE_ID);

		if (!canAccessIdpConsole) {
			abilityStore.clearRules();
			return;
		}

		abilityStore.updateRules(IDP_MENU_RULES);
	}, [abilityStore, data, isError, isLoading, shouldSkip]);

	return children;
});
