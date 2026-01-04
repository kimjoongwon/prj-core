"use client";

import type { UserStatsDto } from "@cocrepo/api";
import { Text } from "@cocrepo/ui";
import { Card, CardBody, Skeleton } from "@heroui/react";

interface MemberStatsCardsProps {
	stats: UserStatsDto;
	isLoading: boolean;
}

interface StatCardProps {
	title: string;
	value: number;
	icon: string;
	color: "primary" | "success" | "warning" | "secondary";
	isLoading: boolean;
}

function StatCard({ title, value, icon, color, isLoading }: StatCardProps) {
	const colorStyles = {
		primary: "bg-primary-50 text-primary-600",
		success: "bg-success-50 text-success-600",
		warning: "bg-warning-50 text-warning-600",
		secondary: "bg-secondary-50 text-secondary-600",
	};

	return (
		<Card className="border-none shadow-sm">
			<CardBody className="flex flex-row items-center gap-4 p-4">
				<div
					className={`flex h-12 w-12 items-center justify-center rounded-lg text-2xl ${colorStyles[color]}`}
				>
					{icon}
				</div>
				<div className="flex flex-col">
					<Text className="text-sm text-default-500">{title}</Text>
					{isLoading ? (
						<Skeleton className="h-7 w-16 rounded" />
					) : (
						<Text className="text-2xl font-bold">{value.toLocaleString()}</Text>
					)}
				</div>
			</CardBody>
		</Card>
	);
}

/**
 * 회원 통계 카드 영역
 */
export function MemberStatsCards({ stats, isLoading }: MemberStatsCardsProps) {
	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			<StatCard
				title="전체 회원"
				value={stats.total}
				icon="👥"
				color="primary"
				isLoading={isLoading}
			/>
			<StatCard
				title="활성 회원"
				value={stats.active}
				icon="✅"
				color="success"
				isLoading={isLoading}
			/>
			<StatCard
				title="비활성 회원"
				value={stats.inactive}
				icon="⏸️"
				color="warning"
				isLoading={isLoading}
			/>
			<StatCard
				title="신규 가입 (30일)"
				value={stats.newThisMonth}
				icon="🆕"
				color="secondary"
				isLoading={isLoading}
			/>
		</div>
	);
}
