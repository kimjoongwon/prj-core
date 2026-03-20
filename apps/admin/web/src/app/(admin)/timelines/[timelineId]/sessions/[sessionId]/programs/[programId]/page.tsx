"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const ProgramDetailPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type ProgramDetailPageParams = {
	timelineId: string;
	sessionId: string;
	programId: string;
};

export default function ProgramDetailPage() {
	const { timelineId, sessionId, programId } =
		useParams<ProgramDetailPageParams>();

	return (
		<ProgramDetailPageClient
			timelineId={timelineId}
			sessionId={sessionId}
			programId={programId}
		/>
	);
}
