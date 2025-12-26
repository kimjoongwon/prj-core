"use client";

import { DesignSystemProvider } from "@cocrepo/design-system";
import { StoreProvider } from "@cocrepo/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

interface ProvidersProps {
	children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
	const router = useRouter();
	const [mounted, setMounted] = useState(false);
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 60 * 1000,
					},
				},
			}),
	);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleNavigate = (path: string) => {
		router.push(path);
	};

	// StoreProvider는 window 객체를 사용하므로 클라이언트 사이드에서만 렌더링
	if (!mounted) {
		return null;
	}

	return (
		<QueryClientProvider client={queryClient}>
			<StoreProvider>
				<DesignSystemProvider navigate={handleNavigate}>
					{children}
				</DesignSystemProvider>
			</StoreProvider>
		</QueryClientProvider>
	);
}
