"use client";

import { observer } from "mobx-react-lite";
import { Select } from "../../input/Select";
import { Switch } from "../../input/Switch";
import { TextArea } from "../../input/TextArea";
import { TextField } from "../../input/TextField";

export type AbilityFormField =
	| "name"
	| "description"
	| "subjectId"
	| "actionId"
	| "fields"
	| "conditions"
	| "inverted"
	| "reason";

export interface AbilityFormOption {
	id: string;
	label: string;
}

export interface AbilityFormState {
	name: string;
	description: string;
	subjectId: string;
	actionId: string;
	fields: string;
	conditions: string;
	inverted: boolean;
	reason: string;
}

export interface AbilityFormProps {
	state: AbilityFormState;
	subjects: AbilityFormOption[];
	actions: AbilityFormOption[];
	readOnly?: boolean;
}

function mapOptions(options: AbilityFormOption[]) {
	return options.map((option) => ({
		value: option.id,
		label: option.label,
	}));
}

/**
 * Ability aggregate의 CASL 필드 조합입니다.
 * route가 readOnly을 정하고, form은 전달받은 state만 수정합니다.
 */
export const AbilityForm = observer(
	({ state, subjects, actions, readOnly = false }: AbilityFormProps) => {
		return (
			<div className="space-y-8">
				<section>
					<h2 className="mb-4 text-lg font-semibold">기본 정보</h2>
					<div className="grid grid-cols-1 gap-4">
						<TextField
							label="권한 이름"
							placeholder="예: manage_users"
							state={state}
							path="name"
							isRequired
							isReadOnly={readOnly}
							isDisabled={readOnly}
							description={
								!readOnly ? undefined : "권한 이름은 수정할 수 없습니다."
							}
						/>
						<TextArea
							label="설명"
							placeholder="권한에 대한 설명을 입력하세요"
							state={state}
							path="description"
							isReadOnly={readOnly}
							isDisabled={readOnly}
							minRows={2}
						/>
					</div>
				</section>
				<section>
					<h2 className="mb-4 text-lg font-semibold">CASL 정보</h2>
					<div className="grid grid-cols-1 gap-4">
						<Select
							label="Subject"
							placeholder="Subject를 선택하세요"
							state={state}
							path="subjectId"
							options={mapOptions(subjects)}
							isDisabled={readOnly}
							isRequired
						/>
						<Select
							label="Action"
							placeholder="Action을 선택하세요"
							state={state}
							path="actionId"
							options={mapOptions(actions)}
							isDisabled={readOnly}
							isRequired
						/>
						<TextArea
							label="Fields"
							placeholder="쉼표로 구분하여 필드를 입력하세요. 예: name, email, phone"
							state={state}
							path="fields"
							isReadOnly={readOnly}
							isDisabled={readOnly}
							minRows={2}
							description="빈 값이면 전체 필드에 대한 권한입니다."
						/>
						<TextArea
							label="Conditions (JSON)"
							placeholder='{"userId": "{{ user.id }}"}'
							state={state}
							path="conditions"
							isReadOnly={readOnly}
							isDisabled={readOnly}
							minRows={4}
							description="ABAC 조건을 JSON 형식으로 입력하세요."
						/>
						<div className="flex items-center justify-between rounded-lg border border-border p-4">
							<div>
								<p className="font-medium">거부 권한 (cannot)</p>
								<p className="text-sm text-muted">
									활성화 시 권한을 거부합니다.
								</p>
							</div>
							<Switch state={state} path="inverted" isDisabled={readOnly} />
						</div>
						{state.inverted ? (
							<TextArea
								label="거부 사유"
								placeholder="권한을 거부하는 이유를 입력하세요"
								state={state}
								path="reason"
								isReadOnly={readOnly}
								isDisabled={readOnly}
								minRows={2}
							/>
						) : null}
					</div>
				</section>
			</div>
		);
	},
);
