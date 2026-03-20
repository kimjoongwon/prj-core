"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const OidcClientEditPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type OidcClientEditPageParams = {
	oidcClientId: string;
};

export default function OidcClientEditPage() {
	const { oidcClientId } = useParams<OidcClientEditPageParams>();

	return <OidcClientEditPageClient oidcClientId={oidcClientId} />;
}
