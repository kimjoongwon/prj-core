"use client";

import type { IdpAccountDto } from "@cocrepo/api/core/idp-accounts";
import type {
	DataGridQueryStates,
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
export interface AccountListScreenQueryStates extends DataGridQueryStates {
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
					queryStates,
					setQueryStates,
				}),
		);
		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const accountRows = accounts ?? [];
		const onClickUnlockAccount = (account: IdpAccountDto) => {
			onClickUnlockAccountButton(account.id);
		};
		const columns = buildIdpAccountTableColumns<IdpAccountDto>({
			onClickUnlockAccount,
		});
		return (
			<VStack>
				<Screen.Header
					title="계정 관리"
					description="IDP 계정의 보안 상태를 관리합니다."
				/>
				<SectionSurface className="rounded-2xl border-border/80 bg-surface">
					<Section overflow="hidden">
						<Section.Body>
							<DataGrid
								config={{
									toolbar: {
										leftInputs,
									},
									table: {
										entity: "IdpAccount",
										columns,
										emptyMessage: "등록된 계정이 없습니다.",
									},
								}}
								rows={accountRows}
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
