"use client";

import {
	getGetIdpAccountQueryKey,
	getGetIdpAccountsQueryKey,
	type IdpAccountDto,
	useGetIdpAccounts,
} from "@cocrepo/api/idp/idp-accounts";
import { useUnlockAccount } from "@cocrepo/api/idp/auth";
import type { InputConfig, MetaDataGridColumnConfig } from "@cocrepo/type";
import {
	ActiveStatusCell,
	ConfirmModal,
	DateTimeCell,
	MetaDataGrid,
	PageTitleBar,
	Surface,
	useMetaDataGridQueryStates,
	VStack,
} from "@cocrepo/ui";
import { Button, Chip, Link, useDisclosure } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, LockOpen } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useState } from "react";

function AccountsPage() {
	return <AccountsPageClient />;
}

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

function isLockedAccount(
	account: Pick<IdpAccountDto, "isPermanentlyLocked" | "lockedUntil">,
) {
	return account.isPermanentlyLocked || !!account.lockedUntil;
}

/**
 * 컬럼 정의
 */
const baseColumns: MetaDataGridColumnConfig<IdpAccountDto>[] = [
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
		size: 180,
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
	const queryClient = useQueryClient();
	const unlockModal = useDisclosure();
	const [accountToUnlock, setAccountToUnlock] = useState<IdpAccountDto | null>(
		null,
	);
	const [queryStates, setQueryStates] = useMetaDataGridQueryStates(leftInputs);
	const queryParams = {
		take: queryStates.take,
		skip: queryStates.skip,
		search: queryStates.search || undefined,
	};

	const { data: response, isLoading } = useGetIdpAccounts(queryParams);
	const { mutate: unlockAccount, isPending: isUnlocking } = useUnlockAccount({
		mutation: {
			onSuccess: (_data, variables) => {
				unlockModal.onClose();
				setAccountToUnlock(null);
				queryClient.invalidateQueries({
					queryKey: getGetIdpAccountsQueryKey(),
				});
				queryClient.invalidateQueries({
					queryKey: getGetIdpAccountQueryKey(variables.userId),
				});
			},
		},
	});

	const accounts = response?.data ?? [];
	const meta = response?.meta;
	const totalCount = meta?.totalCount ?? 0;

	const onClickOpenUnlockModal = (account: IdpAccountDto) => {
		setAccountToUnlock(account);
		unlockModal.onOpen();
	};

	const onCloseUnlockModal = () => {
		setAccountToUnlock(null);
		unlockModal.onClose();
	};

	const onClickConfirmUnlock = () => {
		if (!accountToUnlock) {
			return;
		}

		unlockAccount({ userId: accountToUnlock.id });
	};

	const columns: MetaDataGridColumnConfig<IdpAccountDto>[] = baseColumns.map(
		(column) => {
			if (column.field !== "actions") {
				return column;
			}

			return {
				...column,
				cell: ({ row }) => {
					const account = row.original;
					const isLocked = isLockedAccount(account);

					return (
						<div className="flex items-center justify-center gap-1">
							{isLocked && (
								<Button
									size="sm"
									variant="flat"
									color="primary"
									startContent={<LockOpen className="h-3.5 w-3.5" />}
									onPress={() => onClickOpenUnlockModal(account)}
								>
									잠금 해제
								</Button>
							)}
							<Button
								as={Link}
								href={`/accounts/${account.id}`}
								size="sm"
								variant="light"
								isIconOnly
								aria-label="상세 보기"
							>
								<Eye className="h-4 w-4" />
							</Button>
						</div>
					);
				},
			};
		},
	);

	return (
		<VStack gap={5}>
			<PageTitleBar
				title="계정 관리"
				description="IDP 계정의 보안 상태를 관리합니다."
			/>
			<Surface className="overflow-hidden rounded-2xl border-divider/80 bg-content1/70">
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
					}}
				/>
			</Surface>
			<ConfirmModal
				isOpen={unlockModal.isOpen}
				onClose={onCloseUnlockModal}
				onConfirm={onClickConfirmUnlock}
				title="잠금 해제"
				message={
					<>
						<p>
							<strong>{accountToUnlock?.name ?? accountToUnlock?.email}</strong>
							&nbsp;계정의 잠금을 해제하시겠습니까?
						</p>
						<p className="mt-2 text-sm text-default-400">
							연속 로그인 실패로 누적된 잠금 상태와 실패 횟수가 함께
							초기화됩니다.
						</p>
					</>
				}
				confirmText="잠금 해제"
				confirmColor="primary"
				iconType="warning"
				loading={isUnlocking}
			/>
		</VStack>
	);
}

export const IdpConsoleAccountsPage = observer(AccountsPage);

export default IdpConsoleAccountsPage;
