"use client";

import dynamic from "next/dynamic";

const RoleNewPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function RoleNewPage() {
	return <RoleNewPageClient />;
}
