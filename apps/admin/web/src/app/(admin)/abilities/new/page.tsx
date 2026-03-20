"use client";

import dynamic from "next/dynamic";

const AbilityNewPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function AbilityNewPage() {
	return <AbilityNewPageClient />;
}
