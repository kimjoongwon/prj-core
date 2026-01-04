"use client";

import { Text } from "@cocrepo/ui";
import {
	Avatar,
	Button,
	Checkbox,
	Chip,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Pagination,
	Skeleton,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import {
	ChevronDown,
	ChevronUp,
	Edit,
	Eye,
	MoreVertical,
	Trash2,
} from "lucide-react";
import type { Member, Pagination as PaginationType, Sorting } from "../_stores";

interface MemberTableProps {
	members: Member[];
	isLoading: boolean;
	selectedIds: Set<string>;
	isAllSelected: boolean;
	isIndeterminate: boolean;
	sorting: Sorting;
	pagination: PaginationType;
	totalPages: number;
	onClickSelectAll: () => void;
	onClickSelectMember: (id: string) => void;
	onClickSort: (field: string) => void;
	onClickViewMember: (id: string) => void;
	onClickEditMember: (id: string) => void;
	onClickDeleteMember: (id: string) => void;
	onChangePage: (page: number) => void;
}

// 역할 배지 색상
type RoleColor = "primary" | "secondary" | "warning";
const getRoleColor = (roleName?: string): RoleColor => {
	if (roleName === "SUPER_ADMIN") return "warning";
	if (roleName === "ADMIN") return "secondary";
	return "primary";
};

// 역할 라벨
const getRoleLabel = (roleName?: string): string => {
	if (roleName === "SUPER_ADMIN") return "슈퍼관리자";
	if (roleName === "ADMIN") return "관리자";
	return "회원";
};

// 상태 배지 색상
type StatusColor = "success" | "warning" | "danger";
const getStatusColor = (removedAt: string | null): StatusColor => {
	if (removedAt) return "danger";
	return "success";
};

// 상태 라벨
const getStatusLabel = (removedAt: string | null): string => {
	if (removedAt) return "삭제됨";
	return "활성";
};

// 테이블 로딩 스켈레톤
function TableSkeleton() {
	return (
		<div className="flex flex-col gap-3 p-4">
			{Array.from({ length: 5 }).map((_, i) => (
				<div key={`skeleton-row-${i}`} className="flex items-center gap-4">
					<Skeleton className="h-4 w-4 rounded" />
					<Skeleton className="h-10 w-10 rounded-full" />
					<Skeleton className="h-4 w-24 rounded" />
					<Skeleton className="h-4 w-40 rounded" />
					<Skeleton className="h-4 w-28 rounded" />
					<Skeleton className="h-4 w-16 rounded" />
					<Skeleton className="h-4 w-16 rounded" />
					<Skeleton className="h-4 w-20 rounded" />
				</div>
			))}
		</div>
	);
}

// 정렬 아이콘
function SortIcon({ field, sorting }: { field: string; sorting: Sorting }) {
	if (sorting.field !== field) {
		return <ChevronUp className="h-4 w-4 text-default-300" />;
	}
	return sorting.order === "asc" ? (
		<ChevronUp className="h-4 w-4 text-primary" />
	) : (
		<ChevronDown className="h-4 w-4 text-primary" />
	);
}

/**
 * 회원 테이블 컴포넌트
 */
export function MemberTable({
	members,
	isLoading,
	selectedIds,
	isAllSelected,
	isIndeterminate,
	sorting,
	pagination,
	totalPages,
	onClickSelectAll,
	onClickSelectMember,
	onClickSort,
	onClickViewMember,
	onClickEditMember,
	onClickDeleteMember,
	onChangePage,
}: MemberTableProps) {
	// 날짜 포맷팅
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("ko-KR");
	};

	// 회원의 역할 이름 가져오기
	const getRoleName = (member: Member): string | undefined => {
		return member.tenants?.[0]?.role?.name;
	};

	// 회원의 프로필 이미지 가져오기
	const getAvatarUrl = (member: Member): string | undefined => {
		const avatarFileId = member.profiles?.[0]?.avatarFileId;
		// TODO: 파일 URL 생성 로직 추가
		return avatarFileId ? `/api/files/${avatarFileId}` : undefined;
	};

	if (isLoading) {
		return <TableSkeleton />;
	}

	if (members.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12">
				<Text className="text-lg text-default-400">회원이 없습니다</Text>
				<Text className="text-sm text-default-300">
					검색 조건을 변경하거나 새 회원을 등록해주세요
				</Text>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-4">
			<Table
				aria-label="회원 목록 테이블"
				classNames={{
					wrapper: "shadow-none border border-default-200 rounded-lg",
				}}
			>
				<TableHeader>
					<TableColumn width={50}>
						<Checkbox
							isSelected={isAllSelected}
							isIndeterminate={isIndeterminate}
							onValueChange={onClickSelectAll}
						/>
					</TableColumn>
					<TableColumn width={80}>
						<button
							type="button"
							onClick={() => onClickSort("seq")}
							className="flex items-center gap-1"
						>
							<Text>번호</Text>
							<SortIcon field="seq" sorting={sorting} />
						</button>
					</TableColumn>
					<TableColumn width={60}>
						<Text>프로필</Text>
					</TableColumn>
					<TableColumn width={120}>
						<button
							type="button"
							onClick={() => onClickSort("name")}
							className="flex items-center gap-1"
						>
							<Text>이름</Text>
							<SortIcon field="name" sorting={sorting} />
						</button>
					</TableColumn>
					<TableColumn width={200}>
						<button
							type="button"
							onClick={() => onClickSort("email")}
							className="flex items-center gap-1"
						>
							<Text>이메일</Text>
							<SortIcon field="email" sorting={sorting} />
						</button>
					</TableColumn>
					<TableColumn width={140}>
						<Text>전화번호</Text>
					</TableColumn>
					<TableColumn width={100}>
						<Text>역할</Text>
					</TableColumn>
					<TableColumn width={80}>
						<Text>상태</Text>
					</TableColumn>
					<TableColumn width={120}>
						<button
							type="button"
							onClick={() => onClickSort("createdAt")}
							className="flex items-center gap-1"
						>
							<Text>가입일</Text>
							<SortIcon field="createdAt" sorting={sorting} />
						</button>
					</TableColumn>
					<TableColumn width={100}>
						<Text>액션</Text>
					</TableColumn>
				</TableHeader>
				<TableBody>
					{members.map((member) => {
						const roleName = getRoleName(member);
						return (
							<TableRow key={member.id}>
								<TableCell>
									<Checkbox
										isSelected={selectedIds.has(member.id)}
										onValueChange={() => onClickSelectMember(member.id)}
									/>
								</TableCell>
								<TableCell>
									<Text className="text-default-500">{member.seq}</Text>
								</TableCell>
								<TableCell>
									<Avatar
										src={getAvatarUrl(member)}
										name={member.name}
										size="sm"
										showFallback
									/>
								</TableCell>
								<TableCell>
									<Text className="font-medium">{member.name}</Text>
								</TableCell>
								<TableCell>
									<Text className="text-default-500">{member.email}</Text>
								</TableCell>
								<TableCell>
									<Text className="text-default-500">{member.phone}</Text>
								</TableCell>
								<TableCell>
									<Chip size="sm" color={getRoleColor(roleName)} variant="flat">
										<Text>{getRoleLabel(roleName)}</Text>
									</Chip>
								</TableCell>
								<TableCell>
									<Chip
										size="sm"
										color={getStatusColor(member.removedAt)}
										variant="dot"
									>
										<Text>{getStatusLabel(member.removedAt)}</Text>
									</Chip>
								</TableCell>
								<TableCell>
									<Text className="text-default-500">
										{formatDate(member.createdAt)}
									</Text>
								</TableCell>
								<TableCell>
									<Dropdown>
										<DropdownTrigger>
											<Button isIconOnly variant="light" size="sm">
												<MoreVertical className="h-4 w-4" />
											</Button>
										</DropdownTrigger>
										<DropdownMenu aria-label="회원 액션">
											<DropdownItem
												key="view"
												startContent={<Eye className="h-4 w-4" />}
												onPress={() => onClickViewMember(member.id)}
											>
												<Text>상세 보기</Text>
											</DropdownItem>
											<DropdownItem
												key="edit"
												startContent={<Edit className="h-4 w-4" />}
												onPress={() => onClickEditMember(member.id)}
											>
												<Text>수정</Text>
											</DropdownItem>
											<DropdownItem
												key="delete"
												startContent={<Trash2 className="h-4 w-4" />}
												className="text-danger"
												color="danger"
												onPress={() => onClickDeleteMember(member.id)}
											>
												<Text>삭제</Text>
											</DropdownItem>
										</DropdownMenu>
									</Dropdown>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>

			{/* 페이지네이션 */}
			<div className="flex items-center justify-between px-2">
				<Text className="text-sm text-default-500">
					총 {pagination.total.toLocaleString()}건
				</Text>
				<Pagination
					total={totalPages}
					page={pagination.page}
					onChange={onChangePage}
					showControls
					size="sm"
				/>
			</div>
		</div>
	);
}
