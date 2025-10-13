import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

interface InitContainerProps {
	children: React.ReactNode;
}
function makeQueryClient() {
	return new QueryClient();
}

export const QueryProvider = (props: InitContainerProps) => {
	const { children } = props;
	const queryClient = makeQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<ReactQueryDevtools position="top" />
		</QueryClientProvider>
	);
};
