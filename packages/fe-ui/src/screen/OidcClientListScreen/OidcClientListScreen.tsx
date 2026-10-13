"use client";

import type { OidcClientDto } from "@cocrepo/api/idp/oidc-clients";
import type {
	DataGridQueryState,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
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
import { buildOidcClientTableColumns } from "../../data-grid/columns";
import { Button } from "../../input/Button/Button";

/**
 * 좌측 입력 정의 (검색)
 */
const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "Client ID 또는 이름으로 검색...",
	},
];
export const idpConsoleOidcClientsPageQueryInputs = [...leftInputs];
export interface OidcClientListScreenQueryStates extends DataGridQueryState {
	take: number;
	skip: number;
	search: string;
}
export type OidcClientListScreenSetQueryStates = DataGridSetQueryStates;
export interface OidcClientListScreenProps {
	oidcClients: OidcClientDto[];
	totalCount: number;
	queryStates: OidcClientListScreenQueryStates;
	setQueryStates: OidcClientListScreenSetQueryStates;
	onClickCreateButton: () => void;
}
const oidcClientTableColumns = buildOidcClientTableColumns<OidcClientDto>();
export const OidcClientListScreen = observer(
	({
		oidcClients,
		totalCount,
		queryStates,
		setQueryStates,
		onClickCreateButton,
	}: OidcClientListScreenProps) => {
		const gridState = useMemo(
			() =>
				createDataGridState<OidcClientDto>({
					query: queryStates,
					setQueryStates,
					pagination: { totalCount },
					toolbar: { leftInputs },
					table: {
						rows: oidcClients,
						columns: oidcClientTableColumns,
					},
				}),
			[oidcClients, totalCount, queryStates, setQueryStates],
		);
		return (
			<VStack>
				<Screen.Header
					title="OIDC 클라이언트"
					description="시스템에 등록된 OIDC 클라이언트를 관리합니다."
					actions={
						<Button
							variant="primary"
							startContent={<Plus className="h-4 w-4" />}
							onPress={onClickCreateButton}
						>
							클라이언트 등록
						</Button>
					}
				/>
				<SectionSurface className="rounded-2xl border-border/80 bg-surface">
					<Section overflow="hidden">
						<Section.Body>
							<DataGrid state={gridState} />
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
