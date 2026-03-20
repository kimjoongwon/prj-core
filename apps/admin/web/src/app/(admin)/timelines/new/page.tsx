"use client";

import dynamic from "next/dynamic";

const TimelineNewPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function TimelineNewPage() {
	return <TimelineNewPageClient />;
}
