"use client";

import {
	getGetRoutinesQueryKey,
	type RoutineDto,
	useDeleteRoutine,
	useGetRoutines,
} from "@cocrepo/api/core/routines";
import {
	adminRoutinesPageQueryInputs,
	AdminRoutinesPage,
	type AdminRoutinesPageRoutine,
	useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default observer(function RoutinesPageRoute() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(
		adminRoutinesPageQueryInputs,
	);
	const { data: response, isLoading } = useGetRoutines(
		getRoutineParams(queryStates),
	);
	const deleteMutation = useDeleteRoutine();
	const routines = (response?.data ?? []).map(mapRoutineRow);

	return (
		<AdminRoutinesPage
			routines={routines}
			totalCount={response?.meta?.total ?? 0}
			isLoading={isLoading}
			isDeleting={deleteMutation.isPending}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			onClickCreateButton={() => {
				router.push("/routines/new" as Route);
			}}
			onClickRoutineName={(routineId) => {
				router.push(`/routines/${routineId}` as Route);
			}}
			onDeleteRoutine={async (routineId) => {
				try {
					await deleteMutation.mutateAsync({ routineId });
					await queryClient.invalidateQueries({
						queryKey: getGetRoutinesQueryKey(),
					});
					addToast({
						title: "삭제 성공",
						description: "루틴이 삭제되었습니다.",
						color: "success",
					});
				} catch (error) {
					addToast({
						title: "삭제 실패",
						description:
							error instanceof Error
								? error.message
								: "삭제 중 오류가 발생했습니다. 프로그램에서 사용 중인 루틴은 삭제할 수 없습니다.",
						color: "danger",
					});
					throw error;
				}
			}}
		/>
	);
});

function getRoutineParams(
	queryStates: ReturnType<typeof useMetaDataGridQueryStates>[0],
) {
	return {
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
		spaceScope:
			(queryStates.spaceScope as "CURRENT" | "INCLUDE_ANCESTORS") || undefined,
	};
}

function mapRoutineRow(routine: RoutineDto): AdminRoutinesPageRoutine {
	return {
		id: routine.id,
		name: routine.name,
		label: routine.label,
		createdAt: routine.createdAt,
	};
}
