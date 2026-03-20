"use client";

import dynamic from "next/dynamic";

const RoleCategoriesPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function RoleCategoriesPage() {
	return <RoleCategoriesPageClient />;
}
