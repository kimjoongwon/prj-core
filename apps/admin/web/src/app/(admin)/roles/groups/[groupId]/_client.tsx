"use client";

// TODO: Orval codegen 후 아래 import로 교체
// import { useGetGroupById, useDeleteGroup } from "@cocrepo/api";
import { customInstance } from "@cocrepo/api";
import {
	GroupInfoSection,
	GroupRoleListSection,
	PageSurface,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	useDisclosure,
} from "@heroui/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useRouter } from "next/navigation";

interface RoleGroupDetailPageClientProps {
	groupId: string;
}

/** 그룹 상세 응답 타입 */
interface GroupDetail {
	id: string;
	name: string;
	label?: string | null;
	type: string;
	createdAt: string;
	updatedAt: string;
	roleAssociations?: Array<{
		id: string;
		roleId: string;
		role?: {
			id: string;
			name: string;
			displayName?: string | null;
			isSystem: boolean;
		};
	}>;
}

/**
 * 역할 그룹 상세 페이지 - 클라이언트 컴포넌트
 */
function RoleGroupDetailPageClient({
	groupId,
}: RoleGroupDetailPageClientProps) {
	const router = useRouter();
	const queryClient = useQueryClient();
	const deleteModal = useDisclosure();

	// TODO: Orval codegen 후 useGetGroupById(groupId) 로 교체
	const { data: response, isLoading } = useQuery({
		queryKey: ["/api/v1/groups", groupId],
		queryFn: () =>
			customInstance<{ data: GroupDetail }>({
				url: `/api/v1/groups/${groupId}`,
				method: "GET",
			}),
	});
	const group = response?.data;

	// TODO: Orval codegen 후 useDeleteGroup 으로 교체
	const { mutate: deleteGroup, isPending: isDeleting } = useMutation({
		mutationFn: () =>
			customInstance({
				url: `/api/v1/groups/${groupId}`,
				method: "DELETE",
			}),
		onSuccess: () => {
			deleteModal.onClose();
			queryClient.invalidateQueries({
				queryKey: ["/api/v1/groups"],
			});
			router.push("/roles/groups" as Route);
		},
	});

	const onClickBackButton = () => {
		router.push("/roles/groups" as Route);
	};

	const onClickEditButton = () => {
		router.push(`/roles/groups/${groupId}/edit` as Route);
	};

	const onClickDeleteConfirm = () => {
		deleteGroup();
	};

	if (isLoading) {
		return (
			<PageSurface title="역할 그룹 상세" description="로딩 중...">
				<div className="flex items-center justify-center p-8">
					<span className="text-default-500">로딩 중...</span>
				</div>
			</PageSurface>
		);
	}

	if (!group) {
		return (
			<PageSurface
				title="역할 그룹 상세"
				description="그룹을 찾을 수 없습니다."
			>
				<div className="flex flex-col items-center justify-center gap-4 p-8">
					<p className="text-default-500">그룹을 찾을 수 없습니다.</p>
					<Button variant="flat" onPress={onClickBackButton}>
						목록으로
					</Button>
				</div>
			</PageSurface>
		);
	}

	return (
		<PageSurface
			title="역할 그룹 상세"
			description={`${group.label || group.name} 그룹의 상세 정보입니다.`}
			actions={
				<div className="flex gap-2">
					<Button
						variant="light"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={onClickBackButton}
					>
						목록으로
					</Button>
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
				</div>
			}
		>
			<VStack gap={4}>
				{/* 기본 정보 */}
				<SectionSurface>
					<div className="p-6">
						<h3 className="text-lg font-semibold mb-4">기본 정보</h3>
						<GroupInfoSection
							group={{
								name: group.name,
								label: group.label,
								type: group.type,
								createdAt: group.createdAt,
								updatedAt: group.updatedAt,
							}}
						/>
					</div>
				</SectionSurface>

				{/* 연결된 역할 */}
				<SectionSurface>
					<div className="p-6">
						<h3 className="text-lg font-semibold mb-4">연결된 역할</h3>
						<GroupRoleListSection
							roleAssociations={group.roleAssociations ?? []}
						/>
					</div>
				</SectionSurface>
			</VStack>

			{/* 삭제 확인 모달 */}
			<Modal isOpen={deleteModal.isOpen} onClose={deleteModal.onClose}>
				<ModalContent>
					<ModalHeader>역할 그룹 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{group.label || group.name}</strong> 그룹을
							삭제하시겠습니까?
						</p>
						<p className="text-sm text-danger mt-2">
							이 작업은 되돌릴 수 없습니다. 연결된 역할 연관도 함께 삭제됩니다.
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

export default observer(RoleGroupDetailPageClient);
