"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const ProgramEditPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type ProgramEditPageParams = {
	timelineId: string;
	sessionId: string;
	programId: string;
};

export default function ProgramEditPage() {
	const { timelineId, sessionId, programId } =
		useParams<ProgramEditPageParams>();

	return (
		<ProgramEditPageClient
			timelineId={timelineId}
			sessionId={sessionId}
			programId={programId}
		/>
	);
}
