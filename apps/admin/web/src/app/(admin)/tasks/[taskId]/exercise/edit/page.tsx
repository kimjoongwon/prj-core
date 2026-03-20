"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

const TaskExerciseEditPageClient = dynamic(() => import("./_client"), {
	ssr: false,
});

type TaskExerciseEditPageParams = {
	taskId: string;
};

export default function TaskExerciseEditPage() {
	const { taskId } = useParams<TaskExerciseEditPageParams>();

	return <TaskExerciseEditPageClient taskId={taskId} />;
}
