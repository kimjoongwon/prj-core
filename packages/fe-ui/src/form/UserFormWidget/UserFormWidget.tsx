"use client";

import { Button, Input, Select, SelectItem } from "@cocrepo/ui/heroui";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

export interface RoleOption {
	id: string;
	name: string;
	displayName: string;
}

export interface UserFormData {
	name: string;
	email: string;
	phone: string;
	password: string;
	roleId: string;
}

export interface UserFormWidgetProps {
	mode: "create" | "edit";
	initialData?: Partial<UserFormData>;
	roles: RoleOption[];
	onSubmit: (data: UserFormData) => void;
	onCancel: () => void;
	isSubmitting?: boolean;
}

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

		useEffect(() => {
			if (initialData) {
				state.name = initialData.name || "";
				state.email = initialData.email || "";
				state.phone = initialData.phone || "";
				state.roleId = initialData.roleId || "";
			}
		}, [initialData, state]);

		const validate = (): boolean => {
			const nextErrors: Record<string, string> = {};

			if (!state.name.trim()) {
				nextErrors.name = "이름을 입력해주세요";
			} else if (state.name.length < 2 || state.name.length > 50) {
				nextErrors.name = "이름은 2~50자 사이여야 합니다";
			}

			if (!state.email.trim()) {
				nextErrors.email = "이메일을 입력해주세요";
			} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
				nextErrors.email = "올바른 이메일 형식이 아닙니다";
			}

			if (!state.phone.trim()) {
				nextErrors.phone = "전화번호를 입력해주세요";
			} else if (!/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/.test(state.phone)) {
				nextErrors.phone = "올바른 전화번호 형식이 아닙니다";
			}

			if (mode === "create") {
				if (!state.password) {
					nextErrors.password = "비밀번호를 입력해주세요";
				} else if (state.password.length < 8) {
					nextErrors.password = "비밀번호는 8자 이상이어야 합니다";
				}

				if (!state.roleId) {
					nextErrors.roleId = "역할을 선택해주세요";
				}
			}

			state.errors = nextErrors;
			return Object.keys(nextErrors).length === 0;
		};

		const onSubmitForm = (event: React.FormEvent) => {
			event.preventDefault();
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
			<form onSubmit={onSubmitForm} className="space-y-4">
				<Input
					label="이름"
					placeholder="이름을 입력하세요"
					value={state.name}
					onValueChange={(value) => {
						state.name = value;
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
					onValueChange={(value) => {
						state.email = value;
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
					onValueChange={(value) => {
						state.phone = value;
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
							onValueChange={(value) => {
								state.password = value;
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
								const selectedKey = Array.from(keys)[0] as string;
								state.roleId = selectedKey || "";
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
