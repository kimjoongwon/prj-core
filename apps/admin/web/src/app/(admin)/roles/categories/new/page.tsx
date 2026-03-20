"use client";

import dynamic from "next/dynamic";

const RoleCategoryNewPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function RoleCategoryNewPage() {
	return <RoleCategoryNewPageClient />;
}
