"use client";

import { Card, CardBody, CardHeader, Chip } from "@heroui/react";
import { Building, Shield } from "lucide-react";
import type { MemberTenant } from "../../_stores";

interface MemberTenantInfoProps {
	tenants: MemberTenant[];
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

/**
 * 회원 소속 정보 카드
 */
export function MemberTenantInfo({ tenants }: MemberTenantInfoProps) {
	if (!tenants || tenants.length === 0) {
		return (
			<Card className="border-none shadow-sm">
				<CardHeader className="flex flex-col items-start gap-2 px-6 pb-0 pt-6">
					<span className="text-lg font-semibold">소속 정보</span>
				</CardHeader>
				<CardBody className="px-6 py-6">
					<span className="text-default-500">소속 정보가 없습니다.</span>
				</CardBody>
			</Card>
		);
	}

	return (
		<Card className="border-none shadow-sm">
			<CardHeader className="flex flex-col items-start gap-2 px-6 pb-0 pt-6">
				<span className="text-lg font-semibold">소속 정보</span>
			</CardHeader>
			<CardBody className="gap-4 px-6 py-6">
				{tenants.map((tenant) => (
					<div
						key={tenant.id}
						className="flex items-center justify-between rounded-lg border border-default-200 p-4"
					>
						<div className="flex items-center gap-4">
							<div className="flex h-12 w-12 items-center justify-center rounded-lg bg-default-100">
								<Building className="h-6 w-6 text-default-600" />
							</div>
							<div className="flex flex-col gap-1">
								<div className="flex items-center gap-2">
									<span className="font-medium">{tenant.space?.name}</span>
								</div>
								<span className="text-sm text-default-500">
									역할: {getRoleLabel(tenant.role?.name)}
								</span>
							</div>
						</div>
						<div className="flex items-center gap-2">
							<Shield className="h-4 w-4 text-default-400" />
							<Chip
								size="sm"
								color={getRoleColor(tenant.role?.name)}
								variant="flat"
							>
								<span>{getRoleLabel(tenant.role?.name)}</span>
							</Chip>
						</div>
					</div>
				))}
			</CardBody>
		</Card>
	);
}
