import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import { AIFormTemplatesClient } from "./_client";
import { prefetchAIFormTemplatesData } from "./_prefetch";

interface AIFormTemplatesPageProps {
	searchParams: Promise<{
		take?: string;
		skip?: string;
	}>;
}

export default async function AIFormTemplatesPage({
	searchParams,
}: AIFormTemplatesPageProps) {
	const queryClient = new QueryClient();
	const cookieStore = await cookies();
	const params = await searchParams;

	const take = Number(params.take) || 20;
	const skip = Number(params.skip) || 0;

	await prefetchAIFormTemplatesData(queryClient, cookieStore, {
		take,
		skip,
	});

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<AIFormTemplatesClient />
		</HydrationBoundary>
	);
}
