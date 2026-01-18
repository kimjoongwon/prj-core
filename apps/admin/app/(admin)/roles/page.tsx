"use client";

import { useDeleteRole, useGetRoles } from "@cocrepo/api";
import { ConfirmModal } from "@cocrepo/ui/widgets";
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
import { Plus, Shield } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import Link from "next/link";
import { useRouter } from "next/navigation";

/**
 * 역할 데이터 타입 (API 응답에서 추출)
 */
interface RoleItem {
	id: string;
	name: string;
	displayName?: string;
	description?: string;
	isSystem: boolean;
}

/**
 * 역할 목록 페이지
 *
 * 시스템에 등록된 역할 목록을 관리합니다.
 * - 역할 조회
 * - 역할 추가/수정/삭제
 */
function RolesPage() {
	const router = useRouter();

	// 역할 목록 조회
	const { data: rolesResponse, isLoading, refetch } = useGetRoles();
	const roles = (rolesResponse?.data ?? []) as RoleItem[];

	// 역할 삭제 mutation
	const deleteRoleMutation = useDeleteRole();

	const state = useLocalObservable(() => ({
		// 삭제 모달 상태
		deleteModal: {
			isOpen: false,
			targetRole: null as RoleItem | null,
		},
	}));

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

	/**
	 * 삭제 모달 열기
	 */
	const handleOpenDeleteModal = (role: RoleItem) => {
		state.deleteModal.targetRole = role;
		state.deleteModal.isOpen = true;
	};

	/**
	 * 삭제 모달 닫기
	 */
	const handleCloseDeleteModal = () => {
		state.deleteModal.isOpen = false;
		state.deleteModal.targetRole = null;
	};

	/**
	 * 역할 삭제 실행
	 */
	const handleDeleteRole = async () => {
		const role = state.deleteModal.targetRole;
		if (!role) return;

		try {
			await deleteRoleMutation.mutateAsync({ id: role.id });

			// 모달 닫기
			handleCloseDeleteModal();

			// 목록 새로고침
			refetch();
			router.refresh();
		} catch (err) {
			console.error("역할 삭제 실패:", err);
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
					as={Link}
					href="/roles/new"
					color="primary"
					startContent={<Plus className="h-4 w-4" />}
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
					<TableColumn align="center">유형</TableColumn>
					<TableColumn align="center">작업</TableColumn>
				</TableHeader>
				<TableBody
					items={roles}
					isLoading={isLoading}
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
										<p className="font-medium">
											{role.displayName || role.name}
										</p>
										<p className="text-xs text-default-400">{role.name}</p>
									</div>
								</div>
							</TableCell>
							<TableCell>
								<p className="text-sm text-default-600">
									{role.description || "-"}
								</p>
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
									{role.isSystem ? (
										<Button size="sm" variant="flat" isDisabled>
											수정
										</Button>
									) : (
										<Button
											as={Link}
											href={`/roles/${role.id}/edit`}
											size="sm"
											variant="flat"
										>
											수정
										</Button>
									)}
									<Button
										size="sm"
										variant="flat"
										color="danger"
										isDisabled={role.isSystem}
										onPress={() => handleOpenDeleteModal(role)}
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

			{/* 삭제 확인 모달 */}
			<ConfirmModal
				isOpen={state.deleteModal.isOpen}
				onClose={handleCloseDeleteModal}
				onConfirm={handleDeleteRole}
				title="역할 삭제"
				message={
					state.deleteModal.targetRole ? (
						<>
							<strong>
								{state.deleteModal.targetRole.displayName ||
									state.deleteModal.targetRole.name}
							</strong>{" "}
							역할을 삭제하시겠습니까?
							<br />
							<span className="text-default-500">
								이 작업은 되돌릴 수 없습니다.
							</span>
						</>
					) : null
				}
				confirmText="삭제"
				confirmColor="danger"
				loading={deleteRoleMutation.isPending}
			/>
		</div>
	);
}

export default observer(RolesPage);
