"use client";

import dynamic from "next/dynamic";

const RoleGroupsPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function RoleGroupsPage() {
	return <RoleGroupsPageClient />;
}
