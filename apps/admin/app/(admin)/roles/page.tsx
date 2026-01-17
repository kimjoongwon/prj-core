"use client";

import {
	Button,
	Chip,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@heroui/react";
import { Plus, Shield, Users } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

/**
 * 역할 데이터 타입
 */
interface RoleItem {
	id: string;
	name: string;
	displayName: string;
	description: string;
	userCount: number;
	abilityCount: number;
	isSystem: boolean;
	createdAt: string;
}

/**
 * 역할 목록 페이지
 *
 * 시스템에 등록된 역할 목록을 관리합니다.
 * - 역할 조회
 * - 역할별 사용자 수, 권한 수 확인
 * - 역할 추가/수정/삭제 (추후 구현)
 */
function RolesPage() {
	const state = useLocalObservable(() => ({
		roles: [] as RoleItem[],
		isLoading: false,
		error: null as string | null,
	}));

	/**
	 * 역할 목록 로드
	 */
	const loadRoles = async () => {
		state.isLoading = true;
		state.error = null;

		try {
			// TODO: 실제 API 호출로 교체
			// 더미 데이터
			state.roles = [
				{
					id: "role-1",
					name: "SUPER_ADMIN",
					displayName: "슈퍼 관리자",
					description: "시스템의 모든 권한을 가진 최고 관리자",
					userCount: 2,
					abilityCount: 45,
					isSystem: true,
					createdAt: "2024-01-01",
				},
				{
					id: "role-2",
					name: "ADMIN",
					displayName: "관리자",
					description: "일반 관리 업무를 수행하는 관리자",
					userCount: 5,
					abilityCount: 32,
					isSystem: true,
					createdAt: "2024-01-01",
				},
				{
					id: "role-3",
					name: "USER",
					displayName: "일반 사용자",
					description: "기본 사용자 역할",
					userCount: 150,
					abilityCount: 8,
					isSystem: true,
					createdAt: "2024-01-01",
				},
			];
		} catch (err) {
			state.error = err instanceof Error ? err.message : "역할 목록 로드 실패";
		} finally {
			state.isLoading = false;
		}
	};

	useEffect(() => {
		loadRoles();
	}, []);

	/**
	 * 역할 타입에 따른 Chip 색상
	 */
	const getRoleColor = (name: string) => {
		switch (name) {
			case "SUPER_ADMIN":
				return "danger";
			case "ADMIN":
				return "primary";
			default:
				return "default";
		}
	};

	return (
		<div className="space-y-6">
			{/* 페이지 헤더 */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold">역할 목록</h1>
					<p className="text-default-500">시스템에 등록된 역할을 관리합니다.</p>
				</div>
				<Button
					color="primary"
					startContent={<Plus className="h-4 w-4" />}
					isDisabled
				>
					역할 추가
				</Button>
			</div>

			{/* 역할 테이블 */}
			<Table
				aria-label="역할 목록"
				classNames={{
					wrapper: "bg-content1 shadow-sm",
				}}
			>
				<TableHeader>
					<TableColumn>역할</TableColumn>
					<TableColumn>설명</TableColumn>
					<TableColumn align="center">사용자 수</TableColumn>
					<TableColumn align="center">권한 수</TableColumn>
					<TableColumn align="center">유형</TableColumn>
					<TableColumn align="center">작업</TableColumn>
				</TableHeader>
				<TableBody
					items={state.roles}
					isLoading={state.isLoading}
					emptyContent="등록된 역할이 없습니다."
				>
					{(role) => (
						<TableRow key={role.id}>
							<TableCell>
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
										<Shield className="h-5 w-5 text-primary" />
									</div>
									<div>
										<p className="font-medium">{role.displayName}</p>
										<p className="text-xs text-default-400">{role.name}</p>
									</div>
								</div>
							</TableCell>
							<TableCell>
								<p className="text-sm text-default-600">{role.description}</p>
							</TableCell>
							<TableCell>
								<div className="flex items-center justify-center gap-1">
									<Users className="h-4 w-4 text-default-400" />
									<span>{role.userCount}</span>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex items-center justify-center gap-1">
									<Shield className="h-4 w-4 text-default-400" />
									<span>{role.abilityCount}</span>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex justify-center">
									<Chip
										size="sm"
										color={getRoleColor(role.name)}
										variant="flat"
									>
										{role.isSystem ? "시스템" : "사용자 정의"}
									</Chip>
								</div>
							</TableCell>
							<TableCell>
								<div className="flex justify-center gap-2">
									<Button size="sm" variant="flat" isDisabled={role.isSystem}>
										수정
									</Button>
									<Button
										size="sm"
										variant="flat"
										color="danger"
										isDisabled={role.isSystem}
									>
										삭제
									</Button>
								</div>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>

			{/* 안내 메시지 */}
			<div className="rounded-xl bg-warning-50 p-4">
				<p className="text-sm text-warning-700">
					<strong>참고:</strong> 시스템 역할(SUPER_ADMIN, ADMIN, USER)은
					수정하거나 삭제할 수 없습니다. 권한 설정은 "권한 설정" 메뉴에서 관리할
					수 있습니다.
				</p>
			</div>
		</div>
	);
}

export default observer(RolesPage);
