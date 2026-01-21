"use client";

import { useDeleteUser, useGetUserById } from "@cocrepo/api";
import { UserDetailWidget } from "@cocrepo/ui";
import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";

/**
 * 회원 상세 페이지
 */
function UserDetailPage() {
	const params = useParams();
	const router = useRouter();
	const userId = params.id as string;

	const state = useLocalObservable(() => ({
		isDeleteModalOpen: false,
	}));

	// 회원 상세 조회 - Orval 생성 훅 사용
	const { data: userResponse, isLoading, error } = useGetUserById(userId);
	const user = userResponse?.data;

	// 회원 삭제 mutation
	const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

	/**
	 * 뒤로가기
	 */
	const handleBack = () => {
		router.push("/users" as Route);
	};

	/**
	 * 수정 페이지로 이동
	 */
	const handleEdit = () => {
		router.push(`/users/${userId}/edit` as Route);
	};

	/**
	 * 삭제 모달 열기
	 */
	const handleDeleteClick = () => {
		state.isDeleteModalOpen = true;
	};

	/**
	 * 삭제 확인
	 */
	const handleDeleteConfirm = () => {
		deleteUser(
			{ id: userId },
			{
				onSuccess: () => {
					router.push("/users" as Route);
				},
				onError: () => {
					alert("회원 삭제에 실패했습니다");
				},
				onSettled: () => {
					state.isDeleteModalOpen = false;
				},
			},
		);
	};

	/**
	 * 삭제 모달 닫기
	 */
	const handleDeleteCancel = () => {
		state.isDeleteModalOpen = false;
	};

	if (isLoading) {
		return (
			<div className="flex justify-center py-16">
				<p className="text-default-500">로딩 중...</p>
			</div>
		);
	}

	if (error || !user) {
		return (
			<div className="space-y-4">
				<Button
					variant="light"
					startContent={<ArrowLeft className="h-4 w-4" />}
					onPress={handleBack}
				>
					목록으로
				</Button>
				<div className="rounded-xl bg-danger-50 p-4">
					<p className="text-sm text-danger-700">
						{error?.message || "회원을 찾을 수 없습니다"}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* 뒤로가기 버튼 */}
			<Button
				variant="light"
				startContent={<ArrowLeft className="h-4 w-4" />}
				onPress={handleBack}
			>
				목록으로
			</Button>

			{/* 회원 상세 정보 */}
			<UserDetailWidget
				user={user}
				onEdit={handleEdit}
				onDelete={handleDeleteClick}
			/>

			{/* 삭제 확인 모달 */}
			<Modal
				isOpen={state.isDeleteModalOpen}
				onClose={handleDeleteCancel}
				size="sm"
			>
				<ModalContent>
					<ModalHeader>회원 삭제</ModalHeader>
					<ModalBody>
						<p>
							<strong>{user.name}</strong> 회원을 삭제하시겠습니까?
						</p>
						<p className="text-sm text-default-500">
							삭제된 회원은 탈퇴대기 상태로 변경됩니다.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={handleDeleteCancel}
							isDisabled={isDeleting}
						>
							취소
						</Button>
						<Button
							color="danger"
							onPress={handleDeleteConfirm}
							isLoading={isDeleting}
						>
							삭제
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</div>
	);
}

export default observer(UserDetailPage);
