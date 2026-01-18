"use client";

import { Button, Input, Select, SelectItem } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

/**
 * 역할 옵션 타입
 */
export interface RoleOption {
	id: string;
	name: string;
	displayName: string;
}

/**
 * 폼 데이터 타입
 */
export interface UserFormData {
	name: string;
	email: string;
	phone: string;
	password: string;
	roleId: string;
}

/**
 * 회원 폼 위젯 Props
 */
export interface UserFormWidgetProps {
	/** 폼 모드 (등록/수정) */
	mode: "create" | "edit";
	/** 초기 데이터 (수정 시) */
	initialData?: Partial<UserFormData>;
	/** 역할 목록 */
	roles: RoleOption[];
	/** 제출 핸들러 */
	onSubmit: (data: UserFormData) => void;
	/** 취소 핸들러 */
	onCancel: () => void;
	/** 제출 중 상태 */
	isSubmitting?: boolean;
}

/**
 * 회원 등록/수정 폼 위젯
 *
 * 회원 정보를 입력받는 순수 UI 폼 컴포넌트입니다.
 * - 등록 모드: 모든 필드 필수
 * - 수정 모드: 비밀번호, 역할 제외
 */
export const UserFormWidget = observer(
	({
		mode,
		initialData,
		roles,
		onSubmit,
		onCancel,
		isSubmitting = false,
	}: UserFormWidgetProps) => {
		const state = useLocalObservable(() => ({
			name: "",
			email: "",
			phone: "",
			password: "",
			roleId: "",
			errors: {} as Record<string, string>,
		}));

		// 초기 데이터 설정
		useEffect(() => {
			if (initialData) {
				state.name = initialData.name || "";
				state.email = initialData.email || "";
				state.phone = initialData.phone || "";
				state.roleId = initialData.roleId || "";
			}
		}, [initialData, state]);

		/**
		 * 유효성 검사
		 */
		const validate = (): boolean => {
			const newErrors: Record<string, string> = {};

			if (!state.name.trim()) {
				newErrors.name = "이름을 입력해주세요";
			} else if (state.name.length < 2 || state.name.length > 50) {
				newErrors.name = "이름은 2~50자 사이여야 합니다";
			}

			if (!state.email.trim()) {
				newErrors.email = "이메일을 입력해주세요";
			} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
				newErrors.email = "올바른 이메일 형식이 아닙니다";
			}

			if (!state.phone.trim()) {
				newErrors.phone = "전화번호를 입력해주세요";
			} else if (!/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/.test(state.phone)) {
				newErrors.phone = "올바른 전화번호 형식이 아닙니다";
			}

			// 등록 모드에서만 비밀번호와 역할 검증
			if (mode === "create") {
				if (!state.password) {
					newErrors.password = "비밀번호를 입력해주세요";
				} else if (state.password.length < 8) {
					newErrors.password = "비밀번호는 8자 이상이어야 합니다";
				}

				if (!state.roleId) {
					newErrors.roleId = "역할을 선택해주세요";
				}
			}

			state.errors = newErrors;
			return Object.keys(newErrors).length === 0;
		};

		/**
		 * 폼 제출
		 */
		const handleSubmit = (e: React.FormEvent) => {
			e.preventDefault();
			if (!validate()) return;

			onSubmit({
				name: state.name,
				email: state.email,
				phone: state.phone,
				password: state.password,
				roleId: state.roleId,
			});
		};

		return (
			<form onSubmit={handleSubmit} className="space-y-4">
				<Input
					label="이름"
					placeholder="이름을 입력하세요"
					value={state.name}
					onValueChange={(v) => {
						state.name = v;
					}}
					isRequired
					isInvalid={!!state.errors.name}
					errorMessage={state.errors.name}
					isDisabled={isSubmitting}
				/>

				<Input
					label="이메일"
					placeholder="이메일을 입력하세요"
					type="email"
					value={state.email}
					onValueChange={(v) => {
						state.email = v;
					}}
					isRequired
					isInvalid={!!state.errors.email}
					errorMessage={state.errors.email}
					isDisabled={isSubmitting}
				/>

				<Input
					label="전화번호"
					placeholder="010-1234-5678"
					value={state.phone}
					onValueChange={(v) => {
						state.phone = v;
					}}
					isRequired
					isInvalid={!!state.errors.phone}
					errorMessage={state.errors.phone}
					isDisabled={isSubmitting}
				/>

				{mode === "create" && (
					<>
						<Input
							label="비밀번호"
							placeholder="비밀번호를 입력하세요 (8자 이상)"
							type="password"
							value={state.password}
							onValueChange={(v) => {
								state.password = v;
							}}
							isRequired
							isInvalid={!!state.errors.password}
							errorMessage={state.errors.password}
							isDisabled={isSubmitting}
						/>

						<Select
							label="역할"
							placeholder="역할을 선택하세요"
							selectedKeys={state.roleId ? [state.roleId] : []}
							onSelectionChange={(keys) => {
								const selected = Array.from(keys)[0] as string;
								state.roleId = selected || "";
							}}
							isRequired
							isInvalid={!!state.errors.roleId}
							errorMessage={state.errors.roleId}
							isDisabled={isSubmitting}
						>
							{roles.map((role) => (
								<SelectItem key={role.id}>{role.displayName}</SelectItem>
							))}
						</Select>
					</>
				)}

				<div className="flex justify-end gap-2 pt-4">
					<Button variant="flat" onPress={onCancel} isDisabled={isSubmitting}>
						취소
					</Button>
					<Button type="submit" color="primary" isLoading={isSubmitting}>
						{mode === "create" ? "등록" : "저장"}
					</Button>
				</div>
			</form>
		);
	},
);

UserFormWidget.displayName = "UserFormWidget";
