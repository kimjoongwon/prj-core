"use client";

import { UserSchema } from "@cocrepo/schema";
import type { FormSchemaStateContract } from "@cocrepo/type";
import { observer } from "mobx-react-lite";
import { TextField } from "../../input/TextField";
import { Form } from "../Form";

/**
 * UserForm이 바인딩하는 User 입력 상태입니다.
 */
export interface UserFormState extends FormSchemaStateContract<UserSchema> {
	name: string;
	email: string;
	phone: string;
	password: string;
}

/**
 * UserForm에 외부 상태와 읽기 전용 여부를 전달합니다.
 */
export interface UserFormProps {
	state: UserFormState;
	readOnly?: boolean;
}

/**
 * User 모델의 이름, 이메일, 전화번호, 비밀번호 입력 필드를 제공합니다.
 */
export const UserForm = observer(
	({ state, readOnly = false }: UserFormProps) => {
		return (
			<Form
				aria-label="회원 정보"
				className="flex flex-col gap-6"
				state={state}
				schema={UserSchema}
				readOnly={readOnly}
			>
				<TextField
					label="이름"
					placeholder="홍길동"
					state={state}
					path="name"
					autoComplete="name"
				/>
				<TextField
					label="이메일"
					placeholder="hong@example.com"
					state={state}
					path="email"
					type="email"
					autoComplete="email"
				/>
				<TextField
					label="전화번호"
					placeholder="010-1234-5678"
					state={state}
					path="phone"
					type="tel"
					autoComplete="tel"
				/>
				{readOnly ? null : (
					<TextField
						label="비밀번호"
						placeholder="비밀번호를 입력하세요"
						state={state}
						path="password"
						type="password"
						autoComplete="new-password"
					/>
				)}
			</Form>
		);
	},
);
