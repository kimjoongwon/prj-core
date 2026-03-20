"use client";

import dynamic from "next/dynamic";

const DashboardPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function DashboardPage() {
	return <DashboardPageClient />;
}
