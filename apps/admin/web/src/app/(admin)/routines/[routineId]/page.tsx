"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const RoutineDetailPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type RoutineDetailPageParams = {
	routineId: string;
};

export default function RoutineDetailPage() {
	const { routineId } = useParams<RoutineDetailPageParams>();

	return <RoutineDetailPageClient routineId={routineId} />;
}
