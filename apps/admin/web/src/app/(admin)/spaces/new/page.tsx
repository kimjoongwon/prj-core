"use client";

import dynamic from "next/dynamic";

const SpaceNewPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function SpaceNewPage() {
	return <SpaceNewPageClient />;
}
