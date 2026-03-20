"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const SessionDetailPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type SessionDetailPageParams = {
	timelineId: string;
	sessionId: string;
};

export default function SessionDetailPage() {
	const { timelineId, sessionId } = useParams<SessionDetailPageParams>();

	return (
		<SessionDetailPageClient timelineId={timelineId} sessionId={sessionId} />
	);
}
