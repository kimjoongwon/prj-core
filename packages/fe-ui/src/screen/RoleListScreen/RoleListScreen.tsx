"use client";

import type { RoleDto } from "@cocrepo/api/core/roles";
import type { DataGridQueryState, DataGridSetQueryStates } from "@cocrepo/type";
import {
	buildAdminRoleTableColumns,
	createDataGridState,
	DataGrid,
	Screen,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { Plus } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import { Button } from "../../input/Button/Button";
export interface RoleListScreenQueryStates extends DataGridQueryState {
	take: number;
	skip: number;
}
export type RoleListScreenSetQueryStates = DataGridSetQueryStates;
export interface RoleListScreenProps {
	roles: RoleDto[];
	totalCount: number;
	queryStates: RoleListScreenQueryStates;
	setQueryStates: RoleListScreenSetQueryStates;
	onClickCreateButton: () => void;
}
export const RoleListScreen = observer(
	({
		roles,
		totalCount,
		queryStates,
		setQueryStates,
		onClickCreateButton,
	}: RoleListScreenProps) => {
		const gridState = useMemo(
			() =>
				createDataGridState<RoleDto>({
					query: queryStates,
					setQueryStates,
					pagination: { totalCount },
					table: {
						rows: roles,
						columns: buildAdminRoleTableColumns<RoleDto>(),
					},
				}),
			[roles, totalCount, queryStates, setQueryStates],
		);
		return (
			<VStack gap="page">
				<Screen.Header
					title="역할 목록"
					description="시스템에 등록된 역할을 관리합니다."
					actions={
						<Button
							variant="primary"
							startContent={<Plus className="h-4 w-4" />}
							onPress={onClickCreateButton}
						>
							역할 추가
						</Button>
					}
				/>
				<VStack>
					<VStack gap="block">
						<Section.Header title="역할 목록 데이터" />
						<SectionSurface className="rounded-2xl border-border/80 bg-surface">
							<Section overflow="hidden">
								<Section.Body>
									<DataGrid state={gridState} />
								</Section.Body>
							</Section>
						</SectionSurface>
					</VStack>
				</VStack>
			</VStack>
		);
	},
);
