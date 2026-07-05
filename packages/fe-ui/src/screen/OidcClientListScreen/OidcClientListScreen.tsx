"use client";

import type { OidcClientDto } from "@cocrepo/api/idp/oidc-clients";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildOidcClientTableColumns,
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
export interface OidcClientListScreenQueryStates extends DataGridQueryStates {
	take: number;
	skip: number;
	search: string;
}
export type OidcClientListScreenSetQueryStates = DataGridSetQueryStates;
export interface OidcClientListScreenProps {
	oidcClients?: OidcClientDto[];
	totalCount: number;
	isLoading: boolean;
	queryStates: OidcClientListScreenQueryStates;
	setQueryStates: OidcClientListScreenSetQueryStates;
	onClickCreateButton: () => void;
}
const oidcClientTableColumns = buildOidcClientTableColumns<OidcClientDto>();
export const OidcClientListScreen = observer(
	({
		oidcClients,
		totalCount,
		isLoading,
		queryStates,
		setQueryStates,
		onClickCreateButton,
	}: OidcClientListScreenProps) => {
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
		const oidcClientRows = oidcClients ?? [];
		return (
			<VStack>
				<Screen.Header
					title="OIDC 클라이언트"
					description="시스템에 등록된 OIDC 클라이언트를 관리합니다."
					actions={
						<Button
							color="primary"
							startContent={<Plus className="h-4 w-4" />}
							onPress={onClickCreateButton}
						>
							클라이언트 등록
						</Button>
					}
				/>
				<SectionSurface className="rounded-2xl border-border/80 bg-surface/70">
					<Section overflow="hidden">
						<Section.Body>
							<DataGrid
								config={{
									entity: "OidcClient",
									columns: oidcClientTableColumns,
									leftInputs,
									emptyMessage: "등록된 OIDC 클라이언트가 없습니다.",
								}}
								rows={oidcClientRows}
								totalCount={totalCount}
								state={gridState}
								isLoading={isLoading}
							/>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
