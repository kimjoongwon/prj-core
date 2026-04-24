"use client";

import {
	getGetRoutinesQueryKey,
	type RoutineDto,
	useDeleteRoutine,
	useGetRoutines,
} from "@cocrepo/api/core/routines";
import {
	RoutineListPage,
	type RoutineListPageRoutine,
} from "@cocrepo/ui";
import { addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

interface RoutinesQueryStates {
	take: number;
	skip: number;
	search: string;
	spaceScope: string;
}

export default observer(function RoutinesPageRoute() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		search: parseAsString.withDefault(""),
		spaceScope: parseAsString.withDefault(""),
	});
	const { data: response, isLoading } = useGetRoutines(
		getRoutineParams(queryStates),
	);
	const deleteMutation = useDeleteRoutine();
	const routines = (response?.data ?? []).map(mapRoutineRow);

	return (
		<RoutineListPage
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

function getRoutineParams(queryStates: RoutinesQueryStates) {
	return {
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
		spaceScope:
			(queryStates.spaceScope as "CURRENT" | "INCLUDE_ANCESTORS") || undefined,
	};
}

function mapRoutineRow(routine: RoutineDto): RoutineListPageRoutine {
	return {
		id: routine.id,
		name: routine.name,
		label: routine.label,
		createdAt: routine.createdAt,
	};
}
