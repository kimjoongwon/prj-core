"use client";

import { type IdpAccountDto, useGetIdpAccounts } from "@cocrepo/api";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
    ActiveStatusCell,
    DateTimeCell,
    MetaDataGrid,
    RowActionsCell,
    useMetaDataGridQueryStates,
} from "@cocrepo/ui";
import { Chip } from "@heroui/react";
import { observer } from "mobx-react-lite";

/**
 * 잠금 상태 Cell 컴포넌트
 * isPermanentlyLocked, lockedUntil 상태에 따라 Chip을 다르게 렌더링합니다.
 */
function LockStatusCell({
	isPermanentlyLocked,
	lockedUntil,
}: {
	isPermanentlyLocked: boolean;
	lockedUntil?: string | null;
}) {
	if (isPermanentlyLocked) {
		return (
			<div className="flex w-full justify-center">
				<Chip size="sm" color="danger" variant="flat">
					영구잠금
				</Chip>
			</div>
		);
	}

	if (lockedUntil) {
		return (
			<div className="flex w-full justify-center">
				<Chip size="sm" color="warning" variant="flat">
					일시잠금
				</Chip>
			</div>
		);
	}

	return (
		<div className="flex w-full justify-center">
			<Chip size="sm" color="success" variant="flat">
				정상
			</Chip>
		</div>
	);
}

/**
 * 실패 횟수 Cell 컴포넌트
 * 5회 이상이면 danger 색상으로 표시합니다.
 */
function FailedAttemptsCell({ count }: { count: number }) {
	const isDanger = count >= 5;

	return (
		<div className="flex w-full justify-center">
			<span className={isDanger ? "font-semibold text-danger" : ""}>
				{count}
			</span>
		</div>
	);
}

/**
 * 컬럼 정의
 */
const columns: MetaDataGridColumnConfig<IdpAccountDto>[] = [
	{
		field: "name",
		label: "이름",
		size: 150,
		isRequired: true,
	},
	{
		field: "email",
		label: "이메일",
		size: 200,
	},
	{
		field: "isActive",
		label: "활성 상태",
		size: 80,
		align: "center",
		cell: ({ getValue }) => (
			<ActiveStatusCell isActive={getValue() as boolean} />
		),
	},
	{
		field: "isPermanentlyLocked",
		label: "잠금 상태",
		size: 100,
		align: "center",
		cell: ({ row }) => (
			<LockStatusCell
				isPermanentlyLocked={row.original.isPermanentlyLocked}
				lockedUntil={row.original.lockedUntil}
			/>
		),
	},
	{
		field: "failedLoginAttempts",
		label: "실패 횟수",
		size: 80,
		align: "center",
		cell: ({ getValue }) => <FailedAttemptsCell count={getValue() as number} />,
	},
	{
		field: "lastLoginAt",
		label: "최종 로그인",
		size: 170,
		cell: ({ getValue }) => (
			<DateTimeCell value={getValue() as string | null} />
		),
	},
	{
		field: "actions",
		label: "",
		size: 100,
		cell: ({ row }) => (
			<RowActionsCell
				id={row.original.id}
				basePath="/accounts"
				showView
				showEdit={false}
				showDelete={false}
			/>
		),
	},
];

/**
 * 좌측 입력 정의 (검색)
 */
const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "search",
		placeholder: "이메일 또는 이름으로 검색...",
		props: {
			debounceMs: 300,
		},
	},
];

/**
 * IDP 계정 관리 목록 페이지 - 클라이언트 컴포넌트
 */
function AccountsPageClient() {
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);

	const { data: response, isLoading } = useGetIdpAccounts({
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
	});

	const accounts = response?.data ?? [];
	const meta = response?.meta;
	const totalCount = meta?.totalCount ?? 0;

	return (
        <section><div className="flex items-start justify-between gap-4"><div><h1>{"계정 관리"}</h1><p>{"IDP 계정의 보안 상태를 관리합니다."}</p></div></div>
            <section>
                <MetaDataGrid
                    config={{
                        entity: "IdpAccount",
                        data: accounts,
                        totalCount,
                        isLoading,
                        queryStates,
                        setQueryStates,
                        columns,
                        leftInputs,
                        emptyMessage: "등록된 계정이 없습니다.",
                    }} />
            </section>
        </section>
    );
}

export default observer(AccountsPageClient);
