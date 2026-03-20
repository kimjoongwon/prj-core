"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const ProgramNewPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type ProgramNewPageParams = {
	timelineId: string;
	sessionId: string;
};

export default function ProgramNewPage() {
	const { timelineId, sessionId } = useParams<ProgramNewPageParams>();

	return <ProgramNewPageClient timelineId={timelineId} sessionId={sessionId} />;
}
