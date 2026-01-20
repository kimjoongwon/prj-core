"use client";

import { type UserDto, useGetUsers } from "@cocrepo/api";
import {
	DataGrid,
	DateCell,
	HStack,
	type Key,
	PageSurface,
	Pagination,
	PhoneCell,
	ProfileAvatarCell,
	RoleChipCell,
	RowActionsCell,
	SectionSurface,
	StatusChipCell,
	VStack,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Plus, User } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";

type UserRow = UserDto & { id: string; status?: string };

/**
 * Flat API 응답 구조
 * TODO: Orval 재생성 후 이 타입 제거 (자동 생성됨)
 */
interface FlatUsersResponse {
	data?: UserDto[];
	meta?: { total: number; page: number; limit: number; totalPages: number };
	stats?: {
		total: number;
		active: number;
		inactive: number;
		newThisMonth: number;
	};
}

// 컬럼 정의
const columnHelper = createColumnHelper<UserRow>();

const columns = [
	columnHelper.accessor("name", {
		header: "회원정보",
		cell: ({ row }) => (
			<ProfileAvatarCell
				name={row.original.name}
				subtitle={row.original.email}
				icon={<User className="h-4 w-4" />}
			/>
		),
	}),
	columnHelper.accessor("phone", {
		header: "전화번호",
		cell: ({ getValue }) => <PhoneCell value={getValue()} />,
	}),
	columnHelper.display({
		id: "role",
		header: "역할",
		cell: ({ row }) => <RoleChipCell role={row.original.tenants?.[0]?.role} />,
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
				status={row.original.removedAt ? "inactive" : "active"}
				removedAt={row.original.removedAt}
			/>
		),
	}),
	columnHelper.display({
		id: "actions",
		header: "작업",
		cell: ({ row }) => (
			<RowActionsCell
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

	// Flat 응답 구조: data는 직접 배열, meta는 최상위 레벨
	// TODO: Orval 재생성 후 타입 단언 제거
	const response = usersResponse as unknown as FlatUsersResponse | undefined;
	const users = (response?.data ?? []) as UserRow[];
	const totalCount = response?.meta?.total ?? 0;

	/**
	 * 신규 등록 버튼 클릭
	 */
	const onClickNewButton = () => {
		router.push("/users/new" as Route);
	};

	return (
		<PageSurface
			title="회원 목록"
			description="시스템에 등록된 회원을 관리합니다."
			actions={
				<Button
					color="primary"
					startContent={<Plus className="h-4 w-4" />}
					onPress={onClickNewButton}
				>
					회원 등록
				</Button>
			}
		>
			<VStack gap={4}>
				{/* 회원 DataGrid */}
				<SectionSurface padding="none">
					<DataGrid
						data={users}
						columns={columns as ColumnDef<UserRow, unknown>[]}
						state={{ selectedKeys: state.selectedKeys }}
						isLoading={isLoading}
						tableBody={{ emptyContent: "등록된 회원이 없습니다." }}
					/>
				</SectionSurface>

				{/* 페이지네이션 */}
				{totalCount > state.limit && (
					<HStack justifyContent="center">
						<Pagination
							state={state}
							path="page"
							totalCount={totalCount}
							showControls
						/>
					</HStack>
				)}
			</VStack>
		</PageSurface>
	);
}

export default observer(UsersAllPage);
