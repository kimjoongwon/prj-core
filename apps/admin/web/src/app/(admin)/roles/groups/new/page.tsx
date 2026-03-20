"use client";

import dynamic from "next/dynamic";

const RoleGroupNewPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function RoleGroupNewPage() {
	return <RoleGroupNewPageClient />;
}
