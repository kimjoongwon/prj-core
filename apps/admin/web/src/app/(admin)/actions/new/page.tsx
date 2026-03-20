"use client";

import dynamic from "next/dynamic";

const ActionNewPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function ActionNewPage() {
	return <ActionNewPageClient />;
}
