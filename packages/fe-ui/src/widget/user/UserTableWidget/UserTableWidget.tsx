"use client";

import type { UserDto } from "@cocrepo/api";
import {
	Avatar,
	Button,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import { Eye, Pencil, Trash2, User } from "lucide-react";
import { observer } from "mobx-react-lite";

/**
 * 회원 상태 타입
 */
export type UserStatusType = "active" | "inactive" | "removed";

/**
 * 회원 테이블 위젯 Props
 */
export interface UserTableWidgetProps {
	/** 회원 목록 */
	users: UserDto[];
	/** 로딩 상태 */
	isLoading?: boolean;
	/** 행 클릭 핸들러 (상세 보기) */
	onRowClick?: (user: UserDto) => void;
	/** 수정 버튼 클릭 핸들러 */
	onEditClick?: (user: UserDto) => void;
	/** 삭제 버튼 클릭 핸들러 */
	onDeleteClick?: (user: UserDto) => void;
}

/**
 * 회원 상태에 따른 Chip 색상과 라벨
 */
const getStatusInfo = (
	user: UserDto,
): { label: string; color: "success" | "warning" | "danger" } => {
	if (user.removedAt) {
		return { label: "탈퇴대기", color: "danger" };
	}
	// TODO: 휴면 상태 판단 로직 추가 (최근 로그인 기준)
	return { label: "활성", color: "success" };
};

/**
 * 역할 이름에 따른 Chip 색상
 */
const getRoleColor = (
	roleName?: string,
): "primary" | "secondary" | "default" => {
	switch (roleName?.toUpperCase()) {
		case "FULL_ACCESS":
		case "MANAGE":
			return "primary";
		case "PROJECT":
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

/**
 * 회원 테이블 위젯
 *
 * 회원 목록을 테이블 형태로 표시하는 순수 UI 컴포넌트입니다.
 * - 회원정보 (이름, 이메일)
 * - 전화번호
 * - 역할
 * - 가입일
 * - 상태
 * - 작업 버튼 (상세/수정/삭제)
 */
export const UserTableWidget = observer(
	({
		users,
		isLoading = false,
		onRowClick,
		onEditClick,
		onDeleteClick,
	}: UserTableWidgetProps) => {
		return (
			<Table
				aria-label="회원 목록"
				classNames={{
					wrapper: "bg-content1 shadow-sm",
				}}
			>
				<TableHeader>
					<TableColumn>회원정보</TableColumn>
					<TableColumn>전화번호</TableColumn>
					<TableColumn>역할</TableColumn>
					<TableColumn>가입일</TableColumn>
					<TableColumn align="center">상태</TableColumn>
					<TableColumn align="center">작업</TableColumn>
				</TableHeader>
				<TableBody
					items={users ?? []}
					isLoading={isLoading}
					emptyContent="등록된 회원이 없습니다."
				>
					{(user) => {
						const statusInfo = getStatusInfo(user);
						const role = user.tenants?.[0]?.role;

						return (
							<TableRow
								key={user.id}
								className="cursor-pointer hover:bg-default-100"
								onClick={() => onRowClick?.(user)}
							>
								<TableCell>
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
								</TableCell>
								<TableCell>
									<span className="text-default-600">{user.phone}</span>
								</TableCell>
								<TableCell>
									{role ? (
										<Chip
											size="sm"
											color={getRoleColor(role.name)}
											variant="flat"
										>
											{role.displayName || role.name}
										</Chip>
									) : (
										<span className="text-default-400">-</span>
									)}
								</TableCell>
								<TableCell>
									<span className="text-default-600">
										{formatDate(user.createdAt)}
									</span>
								</TableCell>
								<TableCell>
									<div className="flex justify-center">
										<Chip size="sm" color={statusInfo.color} variant="flat">
											{statusInfo.label}
										</Chip>
									</div>
								</TableCell>
								<TableCell>
									{/* biome-ignore lint/a11y/noStaticElementInteractions: 이벤트 전파 방지용 래퍼 */}
									{/* biome-ignore lint/a11y/useKeyWithClickEvents: 이벤트 전파 방지용 래퍼 */}
									<div
										className="flex justify-center gap-1"
										onClick={(e) => e.stopPropagation()}
									>
										<Button
											size="sm"
											variant="light"
											isIconOnly
											onPress={() => onRowClick?.(user)}
											aria-label="상세 보기"
										>
											<Eye className="h-4 w-4" />
										</Button>
										<Button
											size="sm"
											variant="light"
											isIconOnly
											onPress={() => onEditClick?.(user)}
											aria-label="수정"
										>
											<Pencil className="h-4 w-4" />
										</Button>
										<Button
											size="sm"
											variant="light"
											color="danger"
											isIconOnly
											onPress={() => onDeleteClick?.(user)}
											aria-label="삭제"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						);
					}}
				</TableBody>
			</Table>
		);
	},
);

UserTableWidget.displayName = "UserTableWidget";
