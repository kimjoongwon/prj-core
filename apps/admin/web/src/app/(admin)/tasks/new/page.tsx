"use client";

import dynamic from "next/dynamic";

const TaskNewPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

export default function TaskNewPage() {
	return <TaskNewPageClient />;
}
