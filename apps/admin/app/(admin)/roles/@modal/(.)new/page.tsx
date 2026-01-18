"use client";

import { type CreateRoleDto, useCreateRole } from "@cocrepo/api";
import { type RoleFormData, RoleFormModal } from "@cocrepo/ui/widgets";
import { useQueryClient } from "@tanstack/react-query";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useRouter } from "next/navigation";

/**
 * 역할 추가 모달 (인터셉트 라우트)
 *
 * /roles 페이지에서 "역할 추가" 버튼 클릭 시 모달로 표시됩니다.
 * 직접 /roles/new로 접근하면 목록 페이지로 리디렉션됩니다.
 */
function RoleNewModal() {
	const router = useRouter();
	const queryClient = useQueryClient();

	// 역할 생성 mutation
	const createRoleMutation = useCreateRole();

	const state = useLocalObservable(() => ({
		error: null as string | null,
	}));

	/**
	 * 모달 닫기 (뒤로가기)
	 */
	const handleClose = () => {
		router.back();
	};

	/**
	 * 역할 생성 제출
	 */
	const handleSubmit = async (data: RoleFormData) => {
		state.error = null;

		try {
			const createDto: CreateRoleDto = {
				name: data.name,
				displayName: data.displayName,
				description: data.description || undefined,
			};

			await createRoleMutation.mutateAsync({ data: createDto });

			// 성공 시 역할 목록 캐시 무효화
			queryClient.invalidateQueries({ queryKey: ["getRoles"] });

			// 모달 닫기
			router.back();
			router.refresh();
		} catch (err) {
			state.error = err instanceof Error ? err.message : "역할 생성 실패";
		}
	};

	return (
		<RoleFormModal
			isOpen={true}
			onClose={handleClose}
			onSubmit={handleSubmit}
			mode="create"
			loading={createRoleMutation.isPending}
		/>
	);
}

export default observer(RoleNewModal);
