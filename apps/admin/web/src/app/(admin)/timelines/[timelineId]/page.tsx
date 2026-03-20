"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const TimelineDetailPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type TimelineDetailPageParams = {
	timelineId: string;
};

export default function TimelineDetailPage() {
	const { timelineId } = useParams<TimelineDetailPageParams>();

	return <TimelineDetailPageClient timelineId={timelineId} />;
}
