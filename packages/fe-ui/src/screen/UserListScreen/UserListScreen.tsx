"use client";

import type { UserDto } from "@cocrepo/api/core/users";
import type { DataGridState } from "@cocrepo/ui";
import { DataGrid, Screen, Section, SectionSurface } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { buildUserListTableColumns } from "../../data-grid/columns";
export interface UserListScreenProps {
	users?: UserDto[];
	totalCount?: number;
	state: { dataGrid: DataGridState };
}

const userListTableColumns = buildUserListTableColumns<UserDto>();

export const UserListScreen = observer(
	({ users, state }: UserListScreenProps) => {
		return (
			<Screen>
				<Screen.Header
					title="이용자 목록"
					description="시스템에 등록된 이용자를 조회합니다."
				/>
				<Screen.Body>
					<SectionSurface className="rounded-2xl border-border/80 bg-surface">
						<Section overflow="hidden">
							<Section.Body>
								<DataGrid
									state={state.dataGrid}
								/>
							</Section.Body>
						</Section>
					</SectionSurface>
				</Screen.Body>
			</Screen>
		);
	},
);
UserListScreen.displayName = "UserListScreen";
