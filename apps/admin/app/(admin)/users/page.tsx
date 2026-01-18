"use client";

import { type UserDto, useGetUsers } from "@cocrepo/api";
import { DataGrid, type Key, Pagination } from "@cocrepo/ui";
import { Avatar, Button, Chip, Link } from "@heroui/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Eye, Pencil, Plus, Trash2, User } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";

type UserRow = UserDto & { id: string };

/**
 * 회원 상태에 따른 Chip 색상과 라벨
 */
const getStatusInfo = (
	user: UserRow,
): { label: string; color: "success" | "warning" | "danger" } => {
	if (user.removedAt) {
		return { label: "탈퇴대기", color: "danger" };
	}
	return { label: "활성", color: "success" };
};

/**
 * 역할 이름에 따른 Chip 색상
 */
const getRoleColor = (
	roleName?: string,
): "primary" | "secondary" | "default" => {
	switch (roleName?.toUpperCase()) {
		case "SUPER_ADMIN":
		case "ADMIN":
			return "primary";
		case "MANAGER":
			return "secondary";
		default:
			return "default";
	}
};

/**
 * 날짜 포맷팅
 */
const formatDate = (date: Date | string | null | undefined): string => {
	if (!date) return "-";
	const d = new Date(date);
	return d.toLocaleDateString("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
};

// 컬럼 정의
const columnHelper = createColumnHelper<UserRow>();

const columns = [
	columnHelper.accessor("name", {
		header: "회원정보",
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex items-center gap-3">
					<Avatar
						name={user.name}
						size="sm"
						icon={<User className="h-4 w-4" />}
						classNames={{
							base: "bg-primary/10",
							icon: "text-primary",
						}}
					/>
					<div>
						<p className="font-medium">{user.name}</p>
						<p className="text-xs text-default-400">{user.email}</p>
					</div>
				</div>
			);
		},
	}),
	columnHelper.accessor("phone", {
		header: "전화번호",
		cell: ({ getValue }) => (
			<span className="text-default-600">{getValue()}</span>
		),
	}),
	columnHelper.display({
		id: "role",
		header: "역할",
		cell: ({ row }) => {
			const role = row.original.tenants?.[0]?.role;
			if (!role) return <span className="text-default-400">-</span>;
			return (
				<Chip size="sm" color={getRoleColor(role.name)} variant="flat">
					{role.displayName || role.name}
				</Chip>
			);
		},
	}),
	columnHelper.accessor("createdAt", {
		header: "가입일",
		cell: ({ getValue }) => (
			<span className="text-default-600">{formatDate(getValue())}</span>
		),
	}),
	columnHelper.display({
		id: "status",
		header: "상태",
		cell: ({ row }) => {
			const statusInfo = getStatusInfo(row.original);
			return (
				<div className="flex justify-center">
					<Chip size="sm" color={statusInfo.color} variant="flat">
						{statusInfo.label}
					</Chip>
				</div>
			);
		},
	}),
	columnHelper.display({
		id: "actions",
		header: "작업",
		cell: ({ row }) => {
			const user = row.original;
			return (
				<div className="flex justify-center gap-1">
					<Button
						as={Link}
						href={`/users/${user.id}`}
						size="sm"
						variant="light"
						isIconOnly
						aria-label="상세 보기"
					>
						<Eye className="h-4 w-4" />
					</Button>
					<Button
						as={Link}
						href={`/users/${user.id}/edit`}
						size="sm"
						variant="light"
						isIconOnly
						aria-label="수정"
					>
						<Pencil className="h-4 w-4" />
					</Button>
					<Button
						size="sm"
						variant="light"
						color="danger"
						isIconOnly
						aria-label="삭제"
					>
						<Trash2 className="h-4 w-4" />
					</Button>
				</div>
			);
		},
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
