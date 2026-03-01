import {
	dehydrate,
	HydrationBoundary,
	QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import InquiryEditPageClient from "./_client";
import { prefetchInquiryEditFormData } from "./_prefetch";

interface PageProps {
	params: Promise<{ inquiryId: string }>;
}

export default async function InquiryEditPage({ params }: PageProps) {
	const { inquiryId } = await params;
	const queryClient = new QueryClient();
	const cookieStore = await cookies();

	await prefetchInquiryEditFormData(queryClient, cookieStore, inquiryId);

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<InquiryEditPageClient inquiryId={inquiryId} />
		</HydrationBoundary>
	);
}
