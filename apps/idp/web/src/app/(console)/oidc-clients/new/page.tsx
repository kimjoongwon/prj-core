"use client";

import dynamic from "next/dynamic";

const OidcClientNewPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function OidcClientNewPage() {
	return <OidcClientNewPageClient />;
}
