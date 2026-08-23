"use client";

import type { RoleDto } from "@cocrepo/api/core/roles";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
} from "@cocrepo/type";
import {
	buildAdminRoleTableColumns,
	DataGrid,
	DataGridState,
	Screen,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { Plus } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import { Button } from "../../input/Button/Button";
export interface RoleListScreenQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
}
export type RoleListScreenSetQueryStates = DataGridSetQueryStates;
export interface RoleListScreenProps {
	roles?: RoleDto[];
	totalCount: number;
	isLoading: boolean;
	queryStates: RoleListScreenQueryStates;
	setQueryStates: RoleListScreenSetQueryStates;
	onClickCreateButton: () => void;
}
const RolesScreenFallback = observer(() => {
	return (
		<div className="space-y-5">
			<Screen.Header
				title="역할 목록"
				description="시스템에 등록된 역할을 관리합니다."
			/>
			<SectionSurface className="h-32 rounded-2xl border-border/80 bg-surface">
				<Section>
					<Section.Body>{null}</Section.Body>
				</Section>
			</SectionSurface>
		</div>
	);
});
export const RoleListScreen = observer(
	({
		roles,
		totalCount,
		isLoading,
		queryStates,
		setQueryStates,
		onClickCreateButton,
	}: RoleListScreenProps) => {
		const gridState = useLocalObservable(
			() =>
				new DataGridState({
					queryStates,
					setQueryStates,
				}),
		);
		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const roleRows = roles ?? [];
		const columns = buildAdminRoleTableColumns<RoleDto>();
		if (isLoading) {
			return <RolesScreenFallback />;
		}
		return (
			<div className="space-y-5">
				<Screen.Header
					title="역할 목록"
					description="시스템에 등록된 역할을 관리합니다."
					actions={
						<Button
							color="primary"
							startContent={<Plus className="h-4 w-4" />}
							onPress={onClickCreateButton}
						>
							역할 추가
						</Button>
					}
				/>
				<VStack>
					<div className="space-y-3">
						<Section.Header title="역할 목록 데이터" />
						<SectionSurface className="rounded-2xl border-border/80 bg-surface">
							<Section overflow="hidden">
								<Section.Body>
									<DataGrid
										config={{
											table: {
												entity: "Role",
												columns,
												emptyMessage: "등록된 역할이 없습니다.",
											},
										}}
										rows={roleRows}
										totalCount={totalCount}
										state={gridState}
									/>
								</Section.Body>
							</Section>
						</SectionSurface>
					</div>
				</VStack>
			</div>
		);
	},
);
