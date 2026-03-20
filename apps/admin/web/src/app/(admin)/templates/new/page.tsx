"use client";

import dynamic from "next/dynamic";

const TemplateNewPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function TemplateNewPage() {
	return <TemplateNewPageClient />;
}
