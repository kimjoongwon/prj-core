"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const OidcClientDetailPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type OidcClientDetailPageParams = {
	oidcClientId: string;
};

export default function OidcClientDetailPage() {
	const { oidcClientId } = useParams<OidcClientDetailPageParams>();

	return <OidcClientDetailPageClient oidcClientId={oidcClientId} />;
}
