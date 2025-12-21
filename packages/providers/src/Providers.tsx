import {
  DesignSystemProvider,
  type DesignSystemProviderProps,
} from "@cocrepo/design-system";
import { ToastProvider } from "@heroui/react";
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
 * Providers - Centralized provider composition
 *
 * Combines all application providers:
 * - DesignSystemProvider: HeroUI theme and design tokens
 * - QueryClientProvider: React Query for data fetching and caching
 * - NuqsAdapter: URL state synchronization
 * - ToastProvider: HeroUI toast notifications
 */
export const Providers = (props: ProvidersProps) => {
  const { children, navigate, themeConfig } = props;
  const queryClient = makeQueryClient();

  return (
    <DesignSystemProvider navigate={navigate} themeConfig={themeConfig}>
      <QueryClientProvider client={queryClient}>
        <NuqsAdapter>
          <ToastProvider placement="bottom-center" />
          {children}
          <ReactQueryDevtools position="top" />
        </NuqsAdapter>
      </QueryClientProvider>
    </DesignSystemProvider>
  );
};
