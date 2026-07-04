"use client";

import { observer } from "mobx-react-lite";
import { Switch } from "../../input/Switch";
import { TextArea } from "../../input/TextArea";
import { TextField } from "../../input/TextField";

export type RoleFormField = "name" | "displayName" | "description" | "isSystem";

export interface RoleFormState {
	name: string;
	displayName: string;
	description: string;
	isSystem: boolean;
	errors: Partial<Record<RoleFormField, string>>;
}

export interface RoleFormProps {
	state: RoleFormState;
	readOnly?: boolean;
}

/**
 * Role aggregate의 기본 정보 필드 조합입니다.
 * create/edit/detail 판단은 route가 담당하고, form은 readOnly만 반영합니다.
 */
export const RoleForm = observer(
	({ state, readOnly = false }: RoleFormProps) => {
		return (
			<div className="space-y-6">
				<TextField
					label="역할 식별자"
					placeholder="CUSTOM_ROLE"
					state={state}
					path="name"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					isInvalid={Boolean(state.errors.name)}
					errorMessage={state.errors.name}
					isRequired
					maxLength={50}
					description={
						!readOnly
							? "대문자로 시작하고, 대문자/숫자/밑줄만 사용 가능합니다."
							: "역할 식별자는 수정할 수 없습니다."
					}
					onValueChange={(value) => {
						if (readOnly) {
							return;
						}
						state.name = value.toUpperCase();
						state.errors.name = "";
					}}
				/>
				<TextField
					label="표시명"
					placeholder="사용자 정의 역할"
					state={state}
					path="displayName"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					isInvalid={Boolean(state.errors.displayName)}
					errorMessage={state.errors.displayName}
					maxLength={50}
					description="사용자에게 보여질 역할 이름입니다."
					onValueChange={(value) => {
						if (readOnly) {
							return;
						}
						state.displayName = value;
						state.errors.displayName = "";
					}}
				/>
				<TextArea
					label="설명"
					placeholder="역할에 대한 설명을 입력하세요."
					state={state}
					path="description"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					maxLength={200}
					minRows={3}
				/>
				<Switch state={state} path="isSystem" isDisabled={readOnly}>
					시스템 역할
				</Switch>
			</div>
		);
	},
);
