"use client";

import dynamic from "next/dynamic";

const RoutineNewPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function RoutineNewPage() {
	return <RoutineNewPageClient />;
}
