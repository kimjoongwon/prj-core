"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const SessionEditPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type SessionEditPageParams = {
	timelineId: string;
	sessionId: string;
};

export default function SessionEditPage() {
	const { timelineId, sessionId } = useParams<SessionEditPageParams>();

	return (
		<SessionEditPageClient timelineId={timelineId} sessionId={sessionId} />
	);
}
