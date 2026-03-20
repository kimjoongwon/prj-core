"use client";

import dynamic from "next/dynamic";

const OidcSessionsPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function OidcSessionsPage() {
	return <OidcSessionsPageClient />;
}
