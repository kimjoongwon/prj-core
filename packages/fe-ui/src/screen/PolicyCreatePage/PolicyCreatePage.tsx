"use client";

import {
	FormPage,
	FormPageSurface,
	FormSection,
	FormSectionCard,
	PageTitleBar,
	VStack,
} from "@cocrepo/ui";
import { ArrowLeft, Save } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Checkbox } from "../../selection/Checkbox/Checkbox";
import { Input } from "../../input/Input/Input";
import { Switch } from "../../selection/Switch/Switch";
import { TextArea } from "../../input/TextArea/TextArea";

export interface PolicyCreatePageAbilityOption {
	id: string;
	label: string;
	description?: string | null;
}

export interface PolicyCreatePageForm {
	name: string;
	displayName: string;
	description: string;
	isSystem: boolean;
	abilityIds: string[];
}

export interface PolicyCreatePageChangeHandlers {
	onChangeName: (value: string) => void;
	onChangeDisplayName: (value: string) => void;
	onChangeDescription: (value: string) => void;
	onChangeIsSystem: (value: boolean) => void;
	onToggleAbility: (abilityId: string) => void;
}

export interface PolicyCreatePageProps {
	form: PolicyCreatePageForm;
	abilities: PolicyCreatePageAbilityOption[];
	isSubmitting: boolean;
	onClickBackButton: () => void;
	onClickSubmitButton: () => void;
	onChange: PolicyCreatePageChangeHandlers;
}

export const PolicyCreatePage = observer((props: PolicyCreatePageProps) => {
	const selectedAbilityIds = new Set(props.form.abilityIds);

	return (
		<FormPage
			top={
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
			}
		>
			<PolicyFormBody
				form={props.form}
				abilities={props.abilities}
				selectedAbilityIds={selectedAbilityIds}
				onChange={props.onChange}
			/>
		</FormPage>
	);
});

export const PolicyFormBody = observer(
	({
		form,
		abilities,
		selectedAbilityIds,
		onChange,
	}: {
		form: PolicyCreatePageForm;
		abilities: PolicyCreatePageAbilityOption[];
		selectedAbilityIds: Set<string>;
		onChange: PolicyCreatePageChangeHandlers;
	}) => {
		return (
			<FormPageSurface>
				<VStack gap="section">
					<FormSectionCard>
						<FormSection top={<PageTitleBar level={2} title="기본 정보" />}>
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
						</FormSection>
					</FormSectionCard>
					<FormSectionCard>
						<FormSection
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
						</FormSection>
					</FormSectionCard>
				</VStack>
			</FormPageSurface>
		);
	},
);

PolicyCreatePage.displayName = "PolicyCreatePage";
