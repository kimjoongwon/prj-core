"use client";

import {
	Avatar,
	Button,
	Card,
	CardBody,
	Checkbox,
	Chip,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@heroui/react";
import { Edit, Eye, MoreVertical, Trash2 } from "lucide-react";
import type { Member } from "../_stores/MemberListStore";

interface MemberCardProps {
	member: Member;
	isSelected: boolean;
	onClickSelect: (id: string) => void;
	onClickView: (id: string) => void;
	onClickEdit: (id: string) => void;
	onClickDelete: (id: string) => void;
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

// 회원의 역할 이름 가져오기
const getRoleName = (member: Member): string | undefined => {
	return member.tenants?.[0]?.role?.name;
};

// 회원의 프로필 이미지 가져오기
const getAvatarUrl = (member: Member): string | undefined => {
	const avatarFileId = member.profiles?.[0]?.avatarFileId;
	return avatarFileId ? `/api/files/${avatarFileId}` : undefined;
};

/**
 * 회원 카드 컴포넌트 (모바일용)
 */
export function MemberCard({
	member,
	isSelected,
	onClickSelect,
	onClickView,
	onClickEdit,
	onClickDelete,
}: MemberCardProps) {
	const roleName = getRoleName(member);

	return (
		<Card className="border border-default-200 shadow-sm">
			<CardBody className="flex flex-row items-start gap-3 p-4">
				{/* 체크박스 */}
				<Checkbox
					isSelected={isSelected}
					onValueChange={() => onClickSelect(member.id)}
				/>

				{/* 아바타 */}
				<Avatar
					src={getAvatarUrl(member)}
					name={member.name}
					size="lg"
					showFallback
				/>

				{/* 정보 */}
				<div className="flex flex-1 flex-col gap-1">
					<div className="flex items-center justify-between">
						<span className="font-semibold">{member.name}</span>
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
									onPress={() => onClickView(member.id)}
								>
									<span>상세 보기</span>
								</DropdownItem>
								<DropdownItem
									key="edit"
									startContent={<Edit className="h-4 w-4" />}
									onPress={() => onClickEdit(member.id)}
								>
									<span>수정</span>
								</DropdownItem>
								<DropdownItem
									key="delete"
									startContent={<Trash2 className="h-4 w-4" />}
									className="text-danger"
									color="danger"
									onPress={() => onClickDelete(member.id)}
								>
									<span>삭제</span>
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</div>
					<span className="text-sm text-default-500">{member.email}</span>
					<span className="text-sm text-default-400">{member.phone}</span>
					<div className="mt-2 flex items-center gap-2">
						<Chip size="sm" color={getRoleColor(roleName)} variant="flat">
							<span>{getRoleLabel(roleName)}</span>
						</Chip>
						<Chip
							size="sm"
							color={getStatusColor(member.removedAt)}
							variant="dot"
						>
							<span>{getStatusLabel(member.removedAt)}</span>
						</Chip>
					</div>
				</div>
			</CardBody>
		</Card>
	);
}

interface MemberCardListProps {
	members: Member[];
	selectedIds: Set<string>;
	onClickSelect: (id: string) => void;
	onClickView: (id: string) => void;
	onClickEdit: (id: string) => void;
	onClickDelete: (id: string) => void;
}

/**
 * 회원 카드 목록 (모바일용)
 */
export function MemberCardList({
	members,
	selectedIds,
	onClickSelect,
	onClickView,
	onClickEdit,
	onClickDelete,
}: MemberCardListProps) {
	if (members.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center py-12">
				<span className="text-lg text-default-400">회원이 없습니다</span>
				<span className="text-sm text-default-300">
					검색 조건을 변경하거나 새 회원을 등록해주세요
				</span>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			{members.map((member) => (
				<MemberCard
					key={member.id}
					member={member}
					isSelected={selectedIds.has(member.id)}
					onClickSelect={onClickSelect}
					onClickView={onClickView}
					onClickEdit={onClickEdit}
					onClickDelete={onClickDelete}
				/>
			))}
		</div>
	);
}
