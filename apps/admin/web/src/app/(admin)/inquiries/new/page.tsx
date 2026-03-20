"use client";

import dynamic from "next/dynamic";

const InquiriesNewPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function InquiriesNewPage() {
	return <InquiriesNewPageClient />;
}
