"use client";

import { customInstance } from "@cocrepo/api";
import type { UserDetailResponseDto } from "@cocrepo/dto";
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
import { useEffect } from "react";

/**
 * 회원 상세 페이지
 */
function UserDetailPage() {
	const params = useParams();
	const router = useRouter();
	const userId = params.id as string;

	const state = useLocalObservable(() => ({
		user: null as UserDetailResponseDto | null,
		isLoading: true,
		error: null as string | null,
		isDeleteModalOpen: false,
		isDeleting: false,
	}));

	/**
	 * 회원 정보 로드
	 */
	const loadUser = async () => {
		state.isLoading = true;
		state.error = null;

		try {
			const response = await customInstance<{ data: UserDetailResponseDto }>({
				url: `/api/v1/users/${userId}`,
				method: "GET",
			});

			state.user = response.data;
		} catch (err) {
			state.error =
				err instanceof Error
					? err.message
					: "회원 정보를 불러오는데 실패했습니다";
		} finally {
			state.isLoading = false;
		}
	};

	useEffect(() => {
		loadUser();
	}, [userId]);

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
	const handleDeleteConfirm = async () => {
		state.isDeleting = true;

		try {
			await customInstance({
				url: `/api/v1/users/${userId}`,
				method: "DELETE",
			});

			// 삭제 성공 시 목록으로 이동
			router.push("/users" as Route);
		} catch {
			alert("회원 삭제에 실패했습니다");
		} finally {
			state.isDeleting = false;
			state.isDeleteModalOpen = false;
		}
	};

	/**
	 * 삭제 모달 닫기
	 */
	const handleDeleteCancel = () => {
		state.isDeleteModalOpen = false;
	};

	if (state.isLoading) {
		return (
			<div className="flex justify-center py-16">
				<p className="text-default-500">로딩 중...</p>
			</div>
		);
	}

	if (state.error || !state.user) {
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
						{state.error || "회원을 찾을 수 없습니다"}
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
				user={state.user}
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
							<strong>{state.user.name}</strong> 회원을 삭제하시겠습니까?
						</p>
						<p className="text-sm text-default-500">
							삭제된 회원은 탈퇴대기 상태로 변경됩니다.
						</p>
					</ModalBody>
					<ModalFooter>
						<Button
							variant="flat"
							onPress={handleDeleteCancel}
							isDisabled={state.isDeleting}
						>
							취소
						</Button>
						<Button
							color="danger"
							onPress={handleDeleteConfirm}
							isLoading={state.isDeleting}
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
