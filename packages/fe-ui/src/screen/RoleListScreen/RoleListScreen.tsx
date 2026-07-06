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
					<div className="rounded-xl bg-warning-50 p-4 dark:bg-warning-900/20">
						<p className="text-sm text-warning-700 dark:text-warning-400">
							<strong>참고:</strong> 시스템 역할(PLATFORM_ADMIN,
							COMPANY_MANAGER, MEMBER)은 수정하거나 삭제할 수 없습니다. 권한
							설정은 각 역할의 상세 페이지에서 관리할 수 있습니다.
						</p>
					</div>
					<div className="space-y-3">
						<Section.Header title="역할 목록 데이터" />
						<SectionSurface className="rounded-2xl border-border/80 bg-surface">
							<Section overflow="hidden">
								<Section.Body>
									<DataGrid
										config={{
											entity: "Role",
											columns,
											emptyMessage: "등록된 역할이 없습니다.",
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
