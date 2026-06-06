"use client";
import { type UserDto } from "@cocrepo/api/core/users";
import { Eye, Pencil, Trash2, User } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Avatar, Spinner, Table } from "@heroui/react";
import { Button } from "../../../control/Button/Button";
import { Chip } from "../../../data-display/Chip/Chip";

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
			if (isLoading) {
				return (
					<div className="flex min-h-40 items-center justify-center">
						<Spinner size="sm" />
					</div>
				);
			}

			return (
			<Table
				aria-label="회원 목록"
			>
				<Table.Content>
					<Table.Header>
					<Table.Column>회원정보</Table.Column>
					<Table.Column>전화번호</Table.Column>
					<Table.Column>역할</Table.Column>
					<Table.Column>가입일</Table.Column>
					<Table.Column className="text-center">상태</Table.Column>
					<Table.Column className="text-center">작업</Table.Column>
				</Table.Header>
				<Table.Body
					items={users ?? []}
				>
					{(user) => {
						const statusInfo = getStatusInfo(user);
						const role = user.tenants?.[0]?.role;

						return (
							<Table.Row
								key={user.id}
								className="cursor-pointer hover:bg-default"
								onClick={() => onRowClick?.(user)}
							>
								<Table.Cell>
									<div className="flex items-center gap-3">
										<Avatar size="sm" className="bg-accent/10 text-accent">
											<Avatar.Fallback>
												<User className="h-4 w-4" />
											</Avatar.Fallback>
										</Avatar>
										<div>
											<p className="font-medium">{user.name}</p>
											<p className="text-xs text-muted">{user.email}</p>
										</div>
									</div>
								</Table.Cell>
								<Table.Cell>
									<span className="text-muted">{user.phone}</span>
								</Table.Cell>
								<Table.Cell>
									{role ? (
										<Chip
											size="sm"
											color={getRoleColor(role.name)}
											variant="flat"
										>
											{role.displayName || role.name}
										</Chip>
									) : (
										<span className="text-muted">-</span>
									)}
								</Table.Cell>
								<Table.Cell>
									<span className="text-muted">
										{formatDate(user.createdAt)}
									</span>
								</Table.Cell>
								<Table.Cell>
									<div className="flex justify-center">
										<Chip size="sm" color={statusInfo.color} variant="flat">
											{statusInfo.label}
										</Chip>
									</div>
								</Table.Cell>
								<Table.Cell>
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
								</Table.Cell>
							</Table.Row>
						);
					}}
				</Table.Body>
				</Table.Content>
			</Table>
		);
	},
);

UserTableWidget.displayName = "UserTableWidget";
