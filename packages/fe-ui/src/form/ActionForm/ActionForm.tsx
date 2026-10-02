"use client";

import { observer } from "mobx-react-lite";
import { Select } from "../../input/Select";
import { TextArea } from "../../input/TextArea";
import { TextField } from "../../input/TextField";
import { VStack } from "../../rhythm";

export type ActionFormField =
	| "name"
	| "displayName"
	| "description"
	| "group"
	| "order";

export interface ActionFormState {
	name: string;
	displayName: string;
	description: string;
	group: string;
	order: number;
	errors: Partial<Record<ActionFormField, string>>;
}

export interface ActionFormProps {
	state: ActionFormState;
	readOnly?: boolean;
}

const groupOptions = [
	{ value: "crud", label: "CRUD" },
	{ value: "visibility", label: "Visibility" },
	{ value: "workflow", label: "Workflow" },
	{ value: "bulk", label: "Bulk" },
];

/**
 * Action aggregate의 편집 가능한 필드 조합입니다.
 * create/edit/detail 여부는 route가 정하고, 이 form은 readOnly만 기준으로 필드를 잠급니다.
 */
export const ActionForm = observer(
	({ state, readOnly = false }: ActionFormProps) => {
		return (
			<VStack gap="page">
				<TextField
					label="행위 식별자"
					placeholder="read:masked:email"
					state={state}
					path="name"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					isInvalid={Boolean(state.errors?.name)}
					errorMessage={state.errors?.name}
					isRequired
					description={
						!readOnly
							? "소문자로 시작하고, 소문자/숫자/콜론/밑줄만 사용 가능합니다."
							: "행위 식별자는 수정할 수 없습니다."
					}
					onValueChange={(value) => {
						if (readOnly) {
							return;
						}
						state.name = value.toLowerCase();
						if (state.errors?.name) {
							state.errors.name = "";
						}
					}}
				/>
				<TextField
					label="표시명"
					placeholder="이메일 마스킹 읽기"
					state={state}
					path="displayName"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					maxLength={100}
					description="사용자에게 보여질 Action 이름입니다."
				/>
				<TextArea
					label="설명"
					placeholder="Action에 대한 설명을 입력하세요."
					state={state}
					path="description"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					maxLength={200}
					minRows={3}
				/>
				<Select
					label="분류"
					placeholder="분류를 선택하세요"
					state={state}
					path="group"
					options={groupOptions}
					isDisabled={readOnly}
				/>
				<TextField
					label="정렬 순서"
					type="number"
					state={state}
					path="order"
					isReadOnly={readOnly}
					isDisabled={readOnly}
					description="낮은 숫자일수록 먼저 표시됩니다."
				/>
			</VStack>
		);
	},
);
