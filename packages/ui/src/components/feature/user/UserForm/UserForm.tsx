"use client";

import { useCreateUser, useGetUserById, useUpdateUser } from "@cocrepo/api";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
	type RoleOption,
	type UserFormData,
	UserFormWidget,
} from "../../../widgets/user";

/**
 * 회원 폼 Feature Props
 */
export interface UserFormProps {
	/** 폼 모드 (등록/수정) */
	mode: "create" | "edit";
	/** 회원 ID (수정 시 필수) */
	userId?: string;
	/** 성공 후 이동 경로 */
	redirectPath?: string;
}

/**
 * 회원 폼 Feature 컴포넌트
 *
 * API 연동된 회원 등록/수정 폼입니다.
 * - 역할 목록 자동 로드
 * - 수정 시 기존 데이터 로드
 * - 등록/수정 API 호출
 */
export const UserForm = observer(
	({ mode, userId, redirectPath = "/users" }: UserFormProps) => {
		const router = useRouter();

		const state = useLocalObservable(() => ({
			error: null as string | null,
			roles: [] as RoleOption[],
		}));

		// 회원 정보 조회 (수정 모드일 때만)
		const {
			data: userResponse,
			isLoading,
			error: fetchError,
		} = useGetUserById(userId ?? "", {
			query: {
				enabled: mode === "edit" && !!userId,
			},
		});
		const user = userResponse?.data;

		// 초기 데이터 설정
		const initialData: Partial<UserFormData> | undefined = user
			? {
					name: user.name,
					email: user.email,
					phone: user.phone,
					roleId: user.tenants?.[0]?.roleId || "",
				}
			: undefined;

		// 회원 등록 mutation
		const { mutate: createUser, isPending: isCreating } = useCreateUser();

		// 회원 수정 mutation
		const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

		const isSubmitting = isCreating || isUpdating;

		/**
		 * 역할 목록 로드
		 */
		const loadRoles = () => {
			// TODO: 역할 목록 API 호출
			// 임시 더미 데이터
			state.roles = [
				{ id: "role-user", name: "USER", displayName: "일반 사용자" },
				{ id: "role-manager", name: "MANAGER", displayName: "매니저" },
			];
		};

		// 초기 데이터 로드
		useEffect(() => {
			loadRoles();
		}, []);

		// 페치 에러 처리
		useEffect(() => {
			if (fetchError) {
				state.error = fetchError.message || "회원 정보를 불러오는데 실패했습니다";
			}
		}, [fetchError]);

		/**
		 * 폼 제출
		 */
		const handleSubmit = (data: UserFormData) => {
			state.error = null;

			if (mode === "create") {
				// 등록 API 호출
				createUser(
					{
						data: {
							name: data.name,
							email: data.email,
							phone: data.phone,
							password: data.password!,
							roleId: data.roleId,
						},
					},
					{
						onSuccess: () => {
							router.push(redirectPath as never);
						},
						onError: (err) => {
							state.error = err.message || "저장에 실패했습니다";
						},
					},
				);
			} else {
				// 수정 API 호출
				updateUser(
					{
						id: userId!,
						data: {
							name: data.name,
							email: data.email,
							phone: data.phone,
						},
					},
					{
						onSuccess: () => {
							router.push(redirectPath as never);
						},
						onError: (err) => {
							state.error = err.message || "저장에 실패했습니다";
						},
					},
				);
			}
		};

		/**
		 * 취소 버튼 클릭
		 */
		const handleCancel = () => {
			router.back();
		};

		if (isLoading) {
			return (
				<Card classNames={{ base: "bg-content1" }}>
					<CardBody>
						<div className="flex justify-center py-8">
							<p className="text-default-500">로딩 중...</p>
						</div>
					</CardBody>
				</Card>
			);
		}

		return (
			<Card classNames={{ base: "bg-content1" }}>
				<CardHeader>
					<h2 className="text-xl font-bold">
						{mode === "create" ? "회원 등록" : "회원 수정"}
					</h2>
				</CardHeader>
				<CardBody>
					{/* 에러 메시지 */}
					{state.error && (
						<div className="mb-4 rounded-xl bg-danger-50 p-4">
							<p className="text-sm text-danger-700">{state.error}</p>
						</div>
					)}

					<UserFormWidget
						mode={mode}
						initialData={initialData}
						roles={state.roles}
						onSubmit={handleSubmit}
						onCancel={handleCancel}
						isSubmitting={isSubmitting}
					/>
				</CardBody>
			</Card>
		);
	},
);

UserForm.displayName = "UserForm";
