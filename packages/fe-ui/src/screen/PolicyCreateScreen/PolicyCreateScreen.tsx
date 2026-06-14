"use client";

import { SectionSurface, PageTitleBar, VStack } from "@cocrepo/ui";
import { ArrowLeft, Save } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Checkbox } from "../../selection/Checkbox/Checkbox";
import { Input } from "../../input/Input/Input";
import { Switch } from "../../selection/Switch/Switch";
import { TextArea } from "../../input/TextArea/TextArea";
export interface PolicyCreateScreenAbilityOption {
	id: string;
	label: string;
	description?: string | null;
}
export interface PolicyCreateScreenForm {
	name: string;
	displayName: string;
	description: string;
	isSystem: boolean;
	abilityIds: string[];
}
export interface PolicyCreateScreenChangeHandlers {
	onChangeName: (value: string) => void;
	onChangeDisplayName: (value: string) => void;
	onChangeDescription: (value: string) => void;
	onChangeIsSystem: (value: boolean) => void;
	onToggleAbility: (abilityId: string) => void;
}
export interface PolicyCreateScreenProps {
	form: PolicyCreateScreenForm;
	abilities: PolicyCreateScreenAbilityOption[];
	isSubmitting: boolean;
	onClickBackButton: () => void;
	onClickSubmitButton: () => void;
	onChange: PolicyCreateScreenChangeHandlers;
}
export const PolicyCreateScreen = observer((props: PolicyCreateScreenProps) => {
	const selectedAbilityIds = new Set(props.form.abilityIds);
	return (
		<VStack gap="section" fullWidth>
			<PageTitleBar
				title="정책 등록"
				description="역할과 사용자에게 할당할 정책을 생성합니다."
				actions={
					<div className="flex gap-2">
						<Button
							variant="flat"
							startContent={<ArrowLeft className="h-4 w-4" />}
							onPress={props.onClickBackButton}
						>
							목록으로
						</Button>
						<Button
							color="primary"
							startContent={<Save className="h-4 w-4" />}
							isLoading={props.isSubmitting}
							onPress={props.onClickSubmitButton}
						>
							등록
						</Button>
					</div>
				}
			/>

			<PolicyFormBody
				form={props.form}
				abilities={props.abilities}
				selectedAbilityIds={selectedAbilityIds}
				onChange={props.onChange}
			/>
		</VStack>
	);
});
export const PolicyFormBody = observer(
	({
		form,
		abilities,
		selectedAbilityIds,
		onChange,
	}: {
		form: PolicyCreateScreenForm;
		abilities: PolicyCreateScreenAbilityOption[];
		selectedAbilityIds: Set<string>;
		onChange: PolicyCreateScreenChangeHandlers;
	}) => {
		return (
			<SectionSurface>
				<VStack gap="section">
					<SectionSurface top={<PageTitleBar level={2} title="기본 정보" />}>
						<div className="grid gap-4 md:grid-cols-2">
							<Input
								label="정책 이름"
								placeholder="예: USER_READ_POLICY"
								value={form.name}
								onValueChange={onChange.onChangeName}
								isRequired
							/>
							<Input
								label="표시명"
								placeholder="예: 사용자 조회 정책"
								value={form.displayName}
								onValueChange={onChange.onChangeDisplayName}
							/>
							<TextArea
								className="md:col-span-2"
								label="설명"
								placeholder="정책 설명을 입력하세요"
								value={form.description}
								onValueChange={onChange.onChangeDescription}
								minRows={2}
							/>
							<Switch
								isSelected={form.isSystem}
								onValueChange={onChange.onChangeIsSystem}
							>
								시스템 정책
							</Switch>
						</div>
					</SectionSurface>
					<SectionSurface
						top={
							<PageTitleBar
								level={2}
								title="Ability 선택"
								description="정책에 포함할 Ability를 선택합니다."
							/>
						}
					>
						<div className="grid gap-3">
							{abilities.length > 0 ? (
								abilities.map((ability) => (
									<div
										key={ability.id}
										className="rounded-xl border border-border bg-background/60 p-4"
									>
										<div className="flex items-start justify-between gap-4">
											<div>
												<p className="font-semibold">{ability.label}</p>
												<p className="mt-1 text-sm text-muted">
													{ability.description || "설명 없음"}
												</p>
											</div>
											<Checkbox
												isSelected={selectedAbilityIds.has(ability.id)}
												onValueChange={() =>
													onChange.onToggleAbility(ability.id)
												}
											/>
										</div>
									</div>
								))
							) : (
								<div className="rounded-xl border border-border bg-background/60 p-6 text-center text-sm text-muted">
									선택 가능한 Ability가 없습니다.
								</div>
							)}
						</div>
					</SectionSurface>
				</VStack>
			</SectionSurface>
		);
	},
);
PolicyCreateScreen.displayName = "PolicyCreateScreen";
