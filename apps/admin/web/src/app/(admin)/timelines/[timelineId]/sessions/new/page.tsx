"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const SessionNewPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type SessionNewPageParams = {
	timelineId: string;
};

export default function SessionNewPage() {
	const { timelineId } = useParams<SessionNewPageParams>();

	return <SessionNewPageClient timelineId={timelineId} />;
}
