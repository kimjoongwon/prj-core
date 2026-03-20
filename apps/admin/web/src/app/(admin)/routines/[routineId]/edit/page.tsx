"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const RoutineEditPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type RoutineEditPageParams = {
	routineId: string;
};

export default function RoutineEditPage() {
	const { routineId } = useParams<RoutineEditPageParams>();

	return <RoutineEditPageClient routineId={routineId} />;
}
