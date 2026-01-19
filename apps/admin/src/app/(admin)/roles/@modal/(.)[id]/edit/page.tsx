"use client";

import {
	type UpdateRoleDto,
	useGetRoleById,
	useUpdateRole,
} from "@cocrepo/api";
import { type RoleFormData, RoleFormModal } from "@cocrepo/ui/widgets";
import { useQueryClient } from "@tanstack/react-query";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useParams, useRouter } from "next/navigation";

/**
 * 역할 수정 모달 (인터셉트 라우트)
 *
 * /roles 페이지에서 "수정" 버튼 클릭 시 모달로 표시됩니다.
 * 직접 /roles/[id]/edit으로 접근하면 목록 페이지로 리디렉션됩니다.
 */
function RoleEditModal() {
	const router = useRouter();
	const params = useParams();
	const roleId = params.id as string;
	const queryClient = useQueryClient();

	// 역할 상세 조회
	const { data: roleResponse, isLoading: isFetching } = useGetRoleById(roleId);
	const role = roleResponse?.data;

	// 역할 수정 mutation
	const updateRoleMutation = useUpdateRole();

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
	 * 역할 수정 제출
	 */
	const handleSubmit = async (data: RoleFormData) => {
		state.error = null;

		try {
			const updateDto: UpdateRoleDto = {
				displayName: data.displayName,
				description: data.description || undefined,
			};

			await updateRoleMutation.mutateAsync({ id: roleId, data: updateDto });

			// 성공 시 역할 목록 캐시 무효화
			queryClient.invalidateQueries({ queryKey: ["getRoles"] });
			queryClient.invalidateQueries({ queryKey: ["getRoleById", roleId] });

			// 모달 닫기
			router.back();
			router.refresh();
		} catch (err) {
			state.error = err instanceof Error ? err.message : "역할 수정 실패";
		}
	};

	// 초기 데이터 변환
	const initialData: RoleFormData | undefined = role
		? {
				name: role.name,
				displayName: role.displayName || "",
				description: role.description || "",
			}
		: undefined;

	// 로딩 중이거나 데이터가 없으면 빈 모달 표시
	if (isFetching || !initialData) {
		return (
			<RoleFormModal
				isOpen={true}
				onClose={handleClose}
				onSubmit={() => {}}
				mode="edit"
				loading={true}
			/>
		);
	}

	return (
		<RoleFormModal
			isOpen={true}
			onClose={handleClose}
			onSubmit={handleSubmit}
			mode="edit"
			initialData={initialData}
			loading={updateRoleMutation.isPending}
		/>
	);
}

export default observer(RoleEditModal);
