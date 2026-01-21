"use client";

import type { UserDetailResponseDto } from "@cocrepo/api";
import {
	Avatar,
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
} from "@heroui/react";
import { Mail, Pencil, Phone, Trash2, User } from "lucide-react";
import { observer } from "mobx-react-lite";

/**
 * 회원 상세 위젯 Props
 */
export interface UserDetailWidgetProps {
	/** 회원 정보 */
	user: UserDetailResponseDto;
	/** 수정 버튼 클릭 핸들러 */
	onEdit?: () => void;
	/** 삭제 버튼 클릭 핸들러 */
	onDelete?: () => void;
	/** 로딩 상태 */
	isLoading?: boolean;
}

/**
 * 날짜 포맷팅
 */
const formatDateTime = (date: Date | string | null | undefined): string => {
	if (!date) return "-";
	const d = new Date(date);
	return d.toLocaleString("ko-KR", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
	});
};

/**
 * 회원 상태 정보
 */
const getStatusInfo = (
	user: UserDetailResponseDto,
): { label: string; color: "success" | "warning" | "danger" } => {
	if (user.removedAt) {
		return { label: "탈퇴대기", color: "danger" };
	}
	return { label: "활성", color: "success" };
};

/**
 * 회원 상세 정보 위젯
 *
 * 회원의 상세 정보를 카드 형태로 표시하는 순수 UI 컴포넌트입니다.
 */
export const UserDetailWidget = observer(
	({ user, onEdit, onDelete, isLoading = false }: UserDetailWidgetProps) => {
		const statusInfo = getStatusInfo(user);
		const role = user.tenants?.[0]?.role;

		return (
			<div className="space-y-6">
				{/* 기본 정보 카드 */}
				<Card classNames={{ base: "bg-content1" }}>
					<CardHeader className="flex justify-between">
						<div className="flex items-center gap-4">
							<Avatar
								name={user.name}
								size="lg"
								icon={<User className="h-6 w-6" />}
								classNames={{
									base: "bg-primary/10 h-16 w-16",
									icon: "text-primary",
								}}
							/>
							<div>
								<h2 className="text-xl font-bold">{user.name}</h2>
								<div className="flex items-center gap-2 mt-1">
									<Chip size="sm" color={statusInfo.color} variant="flat">
										{statusInfo.label}
									</Chip>
									{role && (
										<Chip size="sm" variant="flat">
											{role.displayName || role.name}
										</Chip>
									)}
								</div>
							</div>
						</div>
						<div className="flex gap-2">
							<Button
								variant="flat"
								startContent={<Pencil className="h-4 w-4" />}
								onPress={onEdit}
								isDisabled={isLoading}
							>
								수정
							</Button>
							<Button
								variant="flat"
								color="danger"
								startContent={<Trash2 className="h-4 w-4" />}
								onPress={onDelete}
								isDisabled={isLoading}
							>
								삭제
							</Button>
						</div>
					</CardHeader>
					<CardBody>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							{/* 이메일 */}
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-default-100">
									<Mail className="h-5 w-5 text-default-500" />
								</div>
								<div>
									<p className="text-sm text-default-500">이메일</p>
									<p className="font-medium">{user.email}</p>
								</div>
							</div>

							{/* 전화번호 */}
							<div className="flex items-center gap-3">
								<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-default-100">
									<Phone className="h-5 w-5 text-default-500" />
								</div>
								<div>
									<p className="text-sm text-default-500">전화번호</p>
									<p className="font-medium">{user.phone}</p>
								</div>
							</div>
						</div>
					</CardBody>
				</Card>

				{/* 가입 정보 카드 */}
				<Card classNames={{ base: "bg-content1" }}>
					<CardHeader>
						<h3 className="text-lg font-semibold">가입 정보</h3>
					</CardHeader>
					<CardBody>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<p className="text-sm text-default-500">가입일</p>
								<p className="font-medium">{formatDateTime(user.createdAt)}</p>
							</div>
							<div>
								<p className="text-sm text-default-500">최근 수정일</p>
								<p className="font-medium">{formatDateTime(user.updatedAt)}</p>
							</div>
							{user.removedAt && (
								<div>
									<p className="text-sm text-default-500">탈퇴 요청일</p>
									<p className="font-medium text-danger">
										{formatDateTime(user.removedAt)}
									</p>
								</div>
							)}
						</div>
					</CardBody>
				</Card>
			</div>
		);
	},
);

UserDetailWidget.displayName = "UserDetailWidget";
