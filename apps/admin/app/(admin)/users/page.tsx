"use client";

import { type UserDto, useGetUsers } from "@cocrepo/api";
import {
	ActionButtonsCell,
	DataGrid,
	DateCell,
	DefaultCell,
	type Key,
	Pagination,
	ProfileCell,
	RoleChipCell,
	StatusChipCell,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Plus, User } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";

type UserRow = UserDto & { id: string };

// 컬럼 정의
const columnHelper = createColumnHelper<UserRow>();

const columns = [
	columnHelper.accessor("name", {
		header: "회원정보",
		cell: ({ row }) => (
			<ProfileCell
				name={row.original.name}
				subtitle={row.original.email}
				icon={<User className="h-4 w-4" />}
			/>
		),
	}),
	columnHelper.accessor("phone", {
		header: "전화번호",
		cell: ({ getValue }) => <DefaultCell value={getValue() ?? ""} />,
	}),
	columnHelper.display({
		id: "role",
		header: "역할",
		cell: ({ row }) => (
			<RoleChipCell role={row.original.tenants?.[0]?.role} />
		),
	}),
	columnHelper.accessor("createdAt", {
		header: "가입일",
		cell: ({ getValue }) => <DateCell value={getValue()} />,
	}),
	columnHelper.display({
		id: "status",
		header: "상태",
		cell: ({ row }) => (
			<StatusChipCell
				status="active"
				removedAt={row.original.removedAt}
			/>
		),
	}),
	columnHelper.display({
		id: "actions",
		header: "작업",
		cell: ({ row }) => (
			<ActionButtonsCell
				id={row.original.id}
				basePath="/users"
				showDelete={false}
			/>
		),
	}),
];

/**
 * 회원 목록 페이지 - 전체
 */
function UsersAllPage() {
	const router = useRouter();
	const searchParams = useSearchParams();

	// URL에서 초기값 읽기
	const initialPage = Number(searchParams.get("page")) || 1;

	const state = useLocalObservable(() => ({
		selectedKeys: [] as Key[],
		page: initialPage,
		limit: 20,
	}));

	// 회원 목록 조회
	const { data: usersResponse, isLoading } = useGetUsers({
		page: state.page,
		limit: state.limit,
	});

	const users = (usersResponse?.data?.data ?? []) as UserRow[];
	const totalCount = usersResponse?.data?.meta?.total ?? 0;

	/**
	 * 페이지 변경
	 */
	const handlePageChange = (page: number) => {
		state.page = page;
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", String(page));
		router.replace(`?${params.toString()}`);
	};

	/**
	 * 신규 등록 버튼 클릭
	 */
	const handleNewClick = () => {
		router.push("/users/new" as Route);
	};

	return (
		<div className="space-y-4">
			{/* 상단 액션 영역 */}
			<div className="flex items-center justify-end">
				<Button
					color="primary"
					startContent={<Plus className="h-4 w-4" />}
					onPress={handleNewClick}
				>
					회원 등록
				</Button>
			</div>

			{/* 회원 DataGrid */}
			<DataGrid
				data={users}
				columns={columns as ColumnDef<UserRow, unknown>[]}
				state={{ selectedKeys: state.selectedKeys }}
				isLoading={isLoading}
				tableBody={{ emptyContent: "등록된 회원이 없습니다." }}
			/>

			{/* 페이지네이션 */}
			{totalCount > state.limit && (
				<div className="flex justify-center">
					<Pagination
						totalCount={totalCount}
						page={state.page}
						onChange={handlePageChange}
						showControls
					/>
				</div>
			)}
		</div>
	);
}

export default observer(UsersAllPage);
