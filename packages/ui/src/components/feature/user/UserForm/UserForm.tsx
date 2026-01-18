"use client";

import { customInstance } from "@cocrepo/api";
import type { UserDetailResponseDto, UserDto } from "@cocrepo/dto";
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
			isLoading: false,
			isSubmitting: false,
			error: null as string | null,
			roles: [] as RoleOption[],
			initialData: undefined as Partial<UserFormData> | undefined,
		}));

		/**
		 * 역할 목록 로드
		 */
		const loadRoles = async () => {
			try {
				// TODO: 역할 목록 API 호출
				// 임시 더미 데이터
				state.roles = [
					{ id: "role-user", name: "USER", displayName: "일반 사용자" },
					{ id: "role-manager", name: "MANAGER", displayName: "매니저" },
				];
			} catch (err) {
				console.error("역할 목록 로드 실패:", err);
			}
		};

		/**
		 * 회원 정보 로드 (수정 시)
		 */
		const loadUser = async () => {
			if (mode !== "edit" || !userId) return;

			state.isLoading = true;
			try {
				const response = await customInstance<{ data: UserDetailResponseDto }>({
					url: `/api/v1/users/${userId}`,
					method: "GET",
				});

				const user = response.data;
				state.initialData = {
					name: user.name,
					email: user.email,
					phone: user.phone,
					roleId: user.tenants?.[0]?.roleId || "",
				};
			} catch (err) {
				state.error =
					err instanceof Error
						? err.message
						: "회원 정보를 불러오는데 실패했습니다";
			} finally {
				state.isLoading = false;
			}
		};

		// 초기 데이터 로드
		useEffect(() => {
			loadRoles();
			loadUser();
		}, []);

		/**
		 * 폼 제출
		 */
		const handleSubmit = async (data: UserFormData) => {
			state.isSubmitting = true;
			state.error = null;

			try {
				if (mode === "create") {
					// 등록 API 호출
					await customInstance<{ data: UserDto }>({
						url: "/api/v1/users",
						method: "POST",
						data: {
							name: data.name,
							email: data.email,
							phone: data.phone,
							password: data.password,
							roleId: data.roleId,
						},
					});
				} else {
					// 수정 API 호출
					await customInstance<{ data: UserDto }>({
						url: `/api/v1/users/${userId}`,
						method: "PATCH",
						data: {
							name: data.name,
							email: data.email,
							phone: data.phone,
						},
					});
				}

				// 성공 시 목록으로 이동
				router.push(redirectPath as never);
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "저장에 실패했습니다";
				state.error = message;
			} finally {
				state.isSubmitting = false;
			}
		};

		/**
		 * 취소 버튼 클릭
		 */
		const handleCancel = () => {
			router.back();
		};

		if (state.isLoading) {
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
						initialData={state.initialData}
						roles={state.roles}
						onSubmit={handleSubmit}
						onCancel={handleCancel}
						isSubmitting={state.isSubmitting}
					/>
				</CardBody>
			</Card>
		);
	},
);

UserForm.displayName = "UserForm";
