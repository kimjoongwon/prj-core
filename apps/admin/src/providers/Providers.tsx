import {
	DesignSystemProvider,
	type DesignSystemProviderProps,
} from "@cocrepo/design-system";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { NuqsAdapter } from "nuqs/adapters/react";

interface ProvidersProps {
	children: React.ReactNode;
	/**
	 * 라우터 네비게이션 함수 (TanStack Router, React Router 등과 통합)
	 */
	navigate?: DesignSystemProviderProps["navigate"];
	/**
	 * 디자인 시스템 테마 설정
	 */
	themeConfig?: DesignSystemProviderProps["themeConfig"];
}

function makeQueryClient() {
	return new QueryClient();
}

/**
 * Providers - Admin 앱 전용 Provider 조합
 *
 * - DesignSystemProvider: HeroUI 테마 및 디자인 토큰
 * - QueryClientProvider: React Query
 * - NuqsAdapter: URL 상태 관리
 */
export const Providers = (props: ProvidersProps) => {
	const { children, navigate, themeConfig } = props;
	const queryClient = makeQueryClient();

	return (
		<DesignSystemProvider navigate={navigate} themeConfig={themeConfig}>
			<QueryClientProvider client={queryClient}>
				<NuqsAdapter>
					{children}
					<ReactQueryDevtools position="top" />
				</NuqsAdapter>
			</QueryClientProvider>
		</DesignSystemProvider>
	);
};
