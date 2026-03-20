"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const TaskExerciseDetailPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type TaskExerciseDetailPageParams = {
	taskId: string;
};

export default function TaskExerciseDetailPage() {
	const { taskId } = useParams<TaskExerciseDetailPageParams>();

	return <TaskExerciseDetailPageClient taskId={taskId} />;
}
