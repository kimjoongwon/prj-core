"use client";

import { Text } from "@cocrepo/ui";
import {
	Avatar,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
} from "@heroui/react";
import { Calendar, Mail, Phone, User } from "lucide-react";
import type { Member } from "../../_stores";

interface MemberBasicInfoProps {
	member: Member;
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
type StatusColor = "success" | "danger";
const getStatusColor = (removedAt: string | null): StatusColor => {
	if (removedAt) return "danger";
	return "success";
};

// 상태 라벨
const getStatusLabel = (removedAt: string | null): string => {
	if (removedAt) return "삭제됨";
	return "활성";
};

// 날짜 포맷팅
const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("ko-KR", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

const formatDateTime = (dateString: string) => {
	return new Date(dateString).toLocaleString("ko-KR", {
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

/**
 * 회원 기본 정보 카드
 */
export function MemberBasicInfo({ member }: MemberBasicInfoProps) {
	const roleName = member.tenants?.[0]?.role?.name;
	const profile = member.profiles?.[0];
	const avatarUrl = profile?.avatarFileId
		? `/api/files/${profile.avatarFileId}`
		: undefined;

	return (
		<Card className="border-none shadow-sm">
			<CardHeader className="flex flex-col items-start gap-2 px-6 pb-0 pt-6">
				<Text className="text-lg font-semibold">기본 정보</Text>
			</CardHeader>
			<CardBody className="gap-6 px-6 py-6">
				{/* 프로필 영역 */}
				<div className="flex items-center gap-4">
					<Avatar
						src={avatarUrl}
						name={member.name}
						size="lg"
						showFallback
						className="h-20 w-20"
					/>
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-2">
							<Text className="text-xl font-bold">{member.name}</Text>
							<Chip size="sm" color={getRoleColor(roleName)} variant="flat">
								<Text>{getRoleLabel(roleName)}</Text>
							</Chip>
							<Chip
								size="sm"
								color={getStatusColor(member.removedAt)}
								variant="dot"
							>
								<Text>{getStatusLabel(member.removedAt)}</Text>
							</Chip>
						</div>
						{profile?.nickname && (
							<Text className="text-default-500">@{profile.nickname}</Text>
						)}
					</div>
				</div>

				<Divider />

				{/* 정보 목록 */}
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
							<Mail className="h-5 w-5 text-primary" />
						</div>
						<div className="flex flex-col">
							<Text className="text-sm text-default-500">이메일</Text>
							<Text className="font-medium">{member.email}</Text>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-50">
							<Phone className="h-5 w-5 text-success" />
						</div>
						<div className="flex flex-col">
							<Text className="text-sm text-default-500">전화번호</Text>
							<Text className="font-medium">{member.phone || "-"}</Text>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning-50">
							<User className="h-5 w-5 text-warning" />
						</div>
						<div className="flex flex-col">
							<Text className="text-sm text-default-500">회원번호</Text>
							<Text className="font-medium">#{member.seq}</Text>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary-50">
							<Calendar className="h-5 w-5 text-secondary" />
						</div>
						<div className="flex flex-col">
							<Text className="text-sm text-default-500">가입일</Text>
							<Text className="font-medium">
								{formatDate(member.createdAt)}
							</Text>
						</div>
					</div>
				</div>

				<Divider />

				{/* 추가 정보 */}
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="flex flex-col gap-1">
						<Text className="text-sm text-default-500">최근 수정일</Text>
						<Text className="font-medium">
							{formatDateTime(member.updatedAt)}
						</Text>
					</div>
					{member.removedAt && (
						<div className="flex flex-col gap-1">
							<Text className="text-sm text-default-500">삭제일</Text>
							<Text className="font-medium text-danger">
								{formatDateTime(member.removedAt)}
							</Text>
						</div>
					)}
				</div>
			</CardBody>
		</Card>
	);
}
