"use client";

import { observer } from "mobx-react-lite";
import { TextField } from "../../input/TextField";

export type UserFormField = "name" | "email" | "phone";

/**
 * 회원 기본 정보 form이 직접 바인딩하는 상태 계약입니다.
 */
export interface UserFormState {
	name: string;
	email: string;
	phone: string;
	errors: Partial<Record<UserFormField, string>>;
}

/**
 * 회원 상세/수정 화면이 재사용하는 순수 UI form props입니다.
 */
export interface UserFormProps {
	state: UserFormState;
	readOnly?: boolean;
}

/**
 * User aggregate의 기본 정보 필드 조합입니다.
 * route가 편집 가능 여부를 정하고, form은 전달받은 state/path만 바인딩합니다.
 */
export const UserForm = observer(
	({ state, readOnly = false }: UserFormProps) => {
		const clearFieldError = (field: UserFormField) => {
			if (state.errors[field]) {
				delete state.errors[field];
			}
		};

		return (
			<div className="space-y-6">
				<TextField
					label="이름"
					placeholder="홍길동"
					state={state}
					path="name"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					isInvalid={Boolean(state.errors.name)}
					errorMessage={state.errors.name}
					isRequired
					onValueChange={() => clearFieldError("name")}
				/>
				<TextField
					label="이메일"
					placeholder="hong@example.com"
					state={state}
					path="email"
					type="email"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					isInvalid={Boolean(state.errors.email)}
					errorMessage={state.errors.email}
					isRequired
					onValueChange={() => clearFieldError("email")}
				/>
				<TextField
					label="연락처"
					placeholder="010-1234-5678"
					state={state}
					path="phone"
					type="tel"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					isInvalid={Boolean(state.errors.phone)}
					errorMessage={state.errors.phone}
					onValueChange={() => clearFieldError("phone")}
				/>
			</div>
		);
	},
);
