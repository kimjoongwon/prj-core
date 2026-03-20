"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const TimelineEditPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type TimelineEditPageParams = {
	timelineId: string;
};

export default function TimelineEditPage() {
	const { timelineId } = useParams<TimelineEditPageParams>();

	return <TimelineEditPageClient timelineId={timelineId} />;
}
