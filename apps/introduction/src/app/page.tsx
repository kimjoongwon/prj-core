import IntroductionPageClient from "./_client";
import { getIntroductionPageData } from "./_prefetch";

export const dynamic = "force-static";

export default async function IntroductionPage() {
	const pageData = await getIntroductionPageData();

	return <IntroductionPageClient pageData={pageData} />;
}
