"use client";

import {
	getGetRoutinesQueryKey,
	useDeleteRoutine,
	useGetRoutines,
} from "@cocrepo/api/core/routines";
import { RoutineListScreen } from "@cocrepo/ui";
import { toast } from "@heroui/react";
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
	const routineParams = getRoutineParams(queryStates);
	const { data: response, isLoading } = useGetRoutines(routineParams);
	const deleteMutation = useDeleteRoutine();

	return (
		<>
			<RoutineListScreen
				routines={response?.data}
				totalCount={response?.meta?.total ?? 0}
				isLoading={isLoading}
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
						toast.success("삭제 성공", {
							description: "루틴이 삭제되었습니다.",
						});
					} catch (error) {
						toast.danger("삭제 실패", {
							description:
								error instanceof Error
									? error.message
									: "삭제 중 오류가 발생했습니다. 프로그램에서 사용 중인 루틴은 삭제할 수 없습니다.",
						});
						throw error;
					}
				}}
			/>
		</>
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
