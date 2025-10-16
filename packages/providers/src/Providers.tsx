import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastProvider } from "@heroui/react";
import { NuqsAdapter } from "nuqs/adapters/react";

interface ProvidersProps {
	children: React.ReactNode;
}

function makeQueryClient() {
	return new QueryClient();
}

/**
 * Providers - Centralized provider composition
 *
 * Combines all application providers:
 * - QueryClientProvider: React Query for data fetching and caching
 * - NuqsAdapter: URL state synchronization
 * - ToastProvider: HeroUI toast notifications
 */
export const Providers = (props: ProvidersProps) => {
	const { children } = props;
	const queryClient = makeQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			{/* @ts-expect-error - NuqsAdapter React 19 type compatibility issue */}
			<NuqsAdapter>
				<ToastProvider placement="bottom-center" />
				{children}
				{/* @ts-expect-error - ReactQueryDevtools React 19 type compatibility issue */}
				<ReactQueryDevtools position="top" />
			</NuqsAdapter>
		</QueryClientProvider>
	);
};
