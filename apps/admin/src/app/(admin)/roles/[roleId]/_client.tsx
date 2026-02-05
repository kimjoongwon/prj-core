"use client";

import {
	useDeleteRole,
	useGetAbilitiesByRoleId,
	useGetRoleById,
} from "@cocrepo/api";
import { PageSurface, SectionSurface, VStack } from "@cocrepo/ui";
import {
	Button,
	Chip,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	useDisclosure,
} from "@heroui/react";
import { ArrowLeft, Edit, ShieldCheck, ShieldX, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface RoleDetailPageClientProps {
	roleId: string;
}

/**
 * 역할 상세 페이지 - 클라이언트 컴포넌트
 */
function RoleDetailPageClient({ roleId }: RoleDetailPageClientProps) {
	const router = useRouter();
	const deleteModal = useDisclosure();

	// API 조회
	const { data: response, isLoading } = useGetRoleById(roleId);
	const role = response?.data;

	// 역할별 권한 조회
	const { data: abilitiesResponse, isLoading: isLoadingAbilities } =
		useGetAbilitiesByRoleId(roleId);
	const abilities = abilitiesResponse?.data ?? [];

	// 삭제 Mutation
	const { mutate: deleteRole, isPending: isDeleting } = useDeleteRole({
		mutation: {
			onSuccess: () => {
				deleteModal.onClose();
				router.push("/roles" as Route);
			},
		},
	});

	/**
	 * 뒤로가기 핸들러
	 */
	const onClickBackButton = () => {
		router.push("/roles" as Route);
	};

	/**
	 * 수정 페이지 이동 핸들러
	 */
	const onClickEditButton = () => {
		router.push(`/roles/${roleId}/edit` as Route);
	};

	/**
	 * 삭제 확인 핸들러
	 */
	const onClickDeleteConfirm = () => {
		deleteRole({ id: roleId });
	};

	if (isLoading) {
		return (
			<PageSurface title="역할 상세" description="로딩 중...">
				<div className="flex items-center justify-center p-8">
					<span className="text-default-500">로딩 중...</span>
				</div>
			</PageSurface>
		);
	}

	if (!role) {
		return (
			<PageSurface title="역할 상세" description="역할을 찾을 수 없습니다.">
				<div className="flex flex-col items-center justify-center gap-4 p-8">
					<p className="text-default-500">역할을 찾을 수 없습니다.</p>
					<Button variant="flat" onPress={onClickBackButton}>
						목록으로
					</Button>
				</div>
			</PageSurface>
		);
	}

	return (
		<PageSurface
			title="역할 상세"
			description={`${role.displayName || role.name} 역할의 상세 정보입니다.`}
			actions={
				<div className="flex gap-2">
					<Button
						variant="light"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={onClickBackButton}
					>
						목록으로
					</Button>
					{!role.isSystem && (
						<>
							<Button
								variant="flat"
								color="primary"
								startContent={<Edit className="h-4 w-4" />}
								onPress={onClickEditButton}
							>
								수정
							</Button>
							<Button
								variant="flat"
								color="danger"
								startContent={<Trash2 className="h-4 w-4" />}
								onPress={deleteModal.onOpen}
							>
								삭제
							</Button>
						</>
					)}
				</div>
			}
		>
			<VStack gap={4}>
				{/* 시스템 역할 안내 */}
				{role.isSystem && (
					<div className="rounded-xl bg-warning-50 dark:bg-warning-900/20 p-4">
						<p className="text-sm text-warning-700 dark:text-warning-400">
							<strong>시스템 역할:</strong> 이 역할은 시스템에서 기본 제공하는
							역할로, 수정하거나 삭제할 수 없습니다.
						</p>
					</div>
				)}

				{/* 기본 정보 */}
				<SectionSurface>
					<div className="p-6">
						<h3 className="text-lg font-semibold mb-4">기본 정보</h3>
						<dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<dt className="text-sm text-default-500 mb-1">역할 식별자</dt>
								<dd className="flex items-center gap-2">
									<span className="font-mono">{role.name}</span>
									{role.isSystem && (
										<Chip size="sm" color="warning" variant="flat">
											시스템
										</Chip>
									)}
								</dd>
							</div>
							<div>
								<dt className="text-sm text-default-500 mb-1">표시명</dt>
								<dd>{role.displayName || "-"}</dd>
							</div>
							<div className="md:col-span-2">
								<dt className="text-sm text-default-500 mb-1">설명</dt>
								<dd className="text-default-600">
									{role.description || "-"}
								</dd>
							</div>
						</dl>
					</div>
				</SectionSurface>

				{/* 권한 목록 */}
				<SectionSurface>
					<div className="p-6">
						<h3 className="text-lg font-semibold mb-4">권한 목록</h3>
						{isLoadingAbilities ? (
							<div className="flex items-center justify-center p-8">
								<Spinner size="sm" />
								<span className="ml-2 text-default-500">권한 로딩 중...</span>
							</div>
						) : abilities.length === 0 ? (
							<div className="text-center text-default-500 py-8">
								등록된 권한이 없습니다.
							</div>
						) : (
							<Table aria-label="역할 권한 목록" removeWrapper>
								<TableHeader>
									<TableColumn>대상 (Subject)</TableColumn>
									<TableColumn>액션 (Action)</TableColumn>
									<TableColumn>필드</TableColumn>
									<TableColumn>유형</TableColumn>
									<TableColumn>상태</TableColumn>
								</TableHeader>
								<TableBody>
									{abilities.map((ability) => (
										<TableRow key={ability.id}>
											<TableCell>
												<span className="font-medium">
													{String(
														ability.subject?.displayName ||
															ability.subject?.name ||
															ability.subjectId,
													)}
												</span>
											</TableCell>
											<TableCell>
												<span className="font-mono text-sm">
													{String(
														ability.action?.displayName ||
															ability.action?.name ||
															ability.actionId,
													)}
												</span>
											</TableCell>
											<TableCell>
												{ability.fields.length > 0 ? (
													<div className="flex flex-wrap gap-1">
														{ability.fields.slice(0, 3).map((field) => (
															<Chip key={field} size="sm" variant="flat">
																{field}
															</Chip>
														))}
														{ability.fields.length > 3 && (
															<Chip size="sm" variant="flat" color="default">
																+{ability.fields.length - 3}
															</Chip>
														)}
													</div>
												) : (
													<span className="text-default-400">전체</span>
												)}
											</TableCell>
											<TableCell>
												{ability.inverted ? (
													<Chip
														size="sm"
														color="danger"
														variant="flat"
														startContent={<ShieldX className="h-3 w-3" />}
													>
														거부
													</Chip>
												) : (
													<Chip
														size="sm"
														color="success"
														variant="flat"
														startContent={<ShieldCheck className="h-3 w-3" />}
													>
														허용
													</Chip>
												)}
											</TableCell>
											<TableCell>
												<Chip
													size="sm"
													color={ability.isActive ? "success" : "default"}
													variant="dot"
												>
													{ability.isActive ? "활성" : "비활성"}
												</Chip>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						)}
					</div>
				</SectionSurface>

				{/* 추가 정보 */}
				<SectionSurface>
					<div className="p-6">
						<h3 className="text-lg font-semibold mb-4">추가 정보</h3>
						<dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<dt className="text-sm text-default-500 mb-1">상태</dt>
								<dd>
									<Chip
										size="sm"
										color={role.removedAt ? "danger" : "success"}
										variant="flat"
									>
										{role.removedAt ? "삭제됨" : "활성"}
									</Chip>
								</dd>
							</div>
							<div>
								<dt className="text-sm text-default-500 mb-1">생성일</dt>
								<dd>{new Date(role.createdAt).toLocaleString("ko-KR")}</dd>
							</div>
							<div>
								<dt className="text-sm text-default-500 mb-1">수정일</dt>
								<dd>{new Date(role.updatedAt).toLocaleString("ko-KR")}</dd>
							</div>
						</dl>
					</div>
				</SectionSurface>
			</VStack>

			{/* 삭제 확인 모달 */}
			<Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
				<ModalContent>
					<ModalHeader>역할 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{role.displayName || role.name}</strong> 역할을
							삭제하시겠습니까?
						</p>
						<p className="text-sm text-danger mt-2">
							이 작업은 되돌릴 수 없습니다.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={deleteModal.onClose}
							isDisabled={isDeleting}
						>
							취소
						</Button>
						<Button
							color="danger"
							onPress={onClickDeleteConfirm}
							isLoading={isDeleting}
						>
							삭제
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</PageSurface>
	);
}

export default observer(RoleDetailPageClient);
