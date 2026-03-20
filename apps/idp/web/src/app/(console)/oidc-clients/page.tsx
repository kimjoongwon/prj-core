"use client";

import dynamic from "next/dynamic";

const OidcClientsPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function OidcClientsPage() {
	return <OidcClientsPageClient />;
}
