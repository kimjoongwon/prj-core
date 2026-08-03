"use client";

import { observer } from "mobx-react-lite";
import { Checkbox } from "../../input/Checkbox/Checkbox";
import { TextArea } from "../../input/TextArea";
import { TextField } from "../../input/TextField";

export type PolicyFormField =
	| "name"
	| "displayName"
	| "description"
	| "abilityIds";

export interface PolicyEntryOption {
	id: string;
	label: string;
	description?: string | null;
}

export interface PolicyFormState {
	name: string;
	displayName: string;
	description: string;
	abilityIds: string[];
}

export interface PolicyFormProps {
	state: PolicyFormState;
	abilities: PolicyEntryOption[];
	readOnly?: boolean;
}

/**
 * Policy aggregate의 편집 가능한 필드 조합입니다.
 * route가 readOnly을 정하고, form은 전달받은 state만 수정합니다.
 */
export const PolicyForm = observer(
	({ state, abilities, readOnly = false }: PolicyFormProps) => {
		const selectedAbilityIds = new Set(state.abilityIds);

		const toggleAbility = (abilityId: string) => {
			if (readOnly) {
				return;
			}
			state.abilityIds = state.abilityIds.includes(abilityId)
				? state.abilityIds.filter((id) => id !== abilityId)
				: [...state.abilityIds, abilityId];
		};

		return (
			<div className="space-y-8">
				<section>
					<h2 className="mb-4 text-lg font-semibold">기본 정보</h2>
					<div className="grid gap-4 md:grid-cols-2">
						<TextField
							label="정책 이름"
							placeholder="예: USER_READ_POLICY"
							state={state}
							path="name"
							isReadOnly={readOnly}
							isDisabled={readOnly}
							isRequired
						/>
						<TextField
							label="표시명"
							placeholder="예: 사용자 조회 정책"
							state={state}
							path="displayName"
							isReadOnly={readOnly}
							isDisabled={readOnly}
						/>
						<TextArea
							className="md:col-span-2"
							label="설명"
							placeholder="정책 설명을 입력하세요"
							state={state}
							path="description"
							isReadOnly={readOnly}
							isDisabled={readOnly}
							minRows={2}
						/>
					</div>
				</section>
				<section>
					<div className="mb-4">
						<h2 className="text-lg font-semibold">Ability 선택</h2>
						<p className="text-sm text-muted">
							정책에 포함할 Ability를 선택합니다.
						</p>
					</div>
					<div className="grid gap-3">
						{abilities.length > 0 ? (
							abilities.map((ability) => {
								const isSelected = selectedAbilityIds.has(ability.id);
								return (
									<div
										key={ability.id}
										className="rounded-xl border border-border bg-background p-4"
									>
										<div className="flex items-start justify-between gap-4">
											<div>
												<p className="font-semibold">{ability.label}</p>
												<p className="mt-1 text-sm text-muted">
													{ability.description || "설명 없음"}
												</p>
											</div>
											<Checkbox
												isSelected={isSelected}
												isDisabled={readOnly}
												onValueChange={() => {
													toggleAbility(ability.id);
												}}
											/>
										</div>
									</div>
								);
							})
						) : (
							<div className="rounded-xl border border-border bg-background p-6 text-center text-sm text-muted">
								선택 가능한 Ability가 없습니다.
							</div>
						)}
					</div>
				</section>
			</div>
		);
	},
);
