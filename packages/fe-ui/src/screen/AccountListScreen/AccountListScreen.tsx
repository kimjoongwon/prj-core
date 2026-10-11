"use client";

import type { IdpAccountDto } from "@cocrepo/api/idp/idp-accounts";
import type {
	DataGridQueryState,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildIdpAccountTableColumns,
	DataGrid,
	DataGridState,
	Screen,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";
import { DataGridLoading } from "../../data-grid/DataGridLoading";

/**
 * 좌측 입력 정의 (검색)
 */
const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "이메일 또는 이름으로 검색...",
	},
];
export const idpConsoleAccountsPageQueryInputs = [...leftInputs];
export interface AccountListScreenQueryStates extends DataGridQueryState {
	take: number;
	skip: number;
	search: string;
}
export type AccountListScreenSetQueryStates = DataGridSetQueryStates;
export interface AccountListScreenProps {
	accounts?: IdpAccountDto[];
	totalCount: number;
	isLoading: boolean;
	queryStates: AccountListScreenQueryStates;
	setQueryStates: AccountListScreenSetQueryStates;
	onClickUnlockAccountButton: (userId: bigint) => void;
}

/**
 * IDP 계정 관리 목록 pure screen입니다.
 */
export const AccountListScreen = observer(
	({
		accounts,
		totalCount,
		isLoading,
		queryStates,
		setQueryStates,
		onClickUnlockAccountButton,
	}: AccountListScreenProps) => {
		const gridState = useLocalObservable(
			() =>
				new DataGridState({
					query: queryStates,
					setQueryStates,
					toolbar: { leftInputs },
					table: {
						entity: "IdpAccount",
						columns: buildIdpAccountTableColumns<IdpAccountDto>({
							onClickUnlockAccount: (account) =>
								onClickUnlockAccountButton(account.id),
						}),
					},
					rows: accounts ?? [],
					totalCount,
				}),
		);
		useEffect(() => {
			gridState.query.update(queryStates);
			gridState.rows = accounts ?? [];
			gridState.pagination.setTotalCount(totalCount);
		}, [gridState, queryStates, accounts, totalCount]);
		return (
			<VStack>
				<Screen.Header
					title="계정 관리"
					description="IDP 계정의 보안 상태를 관리합니다."
				/>
				<SectionSurface className="rounded-2xl border-border/80 bg-surface">
					<Section overflow="hidden">
						<Section.Body>
							{isLoading ? <DataGridLoading /> : <DataGrid state={gridState} />}
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
