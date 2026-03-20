import ProposalPageClient from "./_client";
import { getProposalPageData } from "./_prefetch";

export const dynamic = "force-static";

export default async function ProposalPage() {
	const pageData = await getProposalPageData();

	return <ProposalPageClient pageData={pageData} />;
}
