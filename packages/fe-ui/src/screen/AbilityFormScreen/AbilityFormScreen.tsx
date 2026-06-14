"use client";

import { ArrowLeft, Save } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Input } from "../../input/Input/Input";
import { Select } from "../../selection/Select/Select";
import { Spinner, ListBox } from "@heroui/react";
import { Switch } from "../../selection/Switch/Switch";
import { TextArea } from "../../input/TextArea/TextArea";
import { SectionSurface } from "../../surface";
import { VStack } from "../../rhythm";
import { PageTitleBar } from "../../widget";
export interface AbilityFormScreenOption {
	id: string;
	label: string;
}
export interface AbilityFormScreenForm {
	name: string;
	description: string;
	subjectId: string;
	actionId: string;
	fields: string;
	conditions: string;
	inverted: boolean;
	reason: string;
}
export interface AbilityFormScreenChangeHandlers {
	onChangeName: (value: string) => void;
	onChangeDescription: (value: string) => void;
	onChangeSubjectId: (value: string) => void;
	onChangeActionId: (value: string) => void;
	onChangeFields: (value: string) => void;
	onChangeConditions: (value: string) => void;
	onChangeInverted: (value: boolean) => void;
	onChangeReason: (value: string) => void;
}
type AbilityFormScreenLoadingProps = {
	status: "loading";
	mode: "create" | "edit";
	title: string;
	description: string;
};
type AbilityFormScreenNotFoundProps = {
	status: "not_found";
	mode: "edit";
	title: string;
	description: string;
	onClickNotFoundBackButton: () => void;
};
type AbilityFormScreenReadyProps = {
	status: "ready";
	mode: "create" | "edit";
	title: string;
	description: string;
	backButtonLabel: string;
	submitButtonLabel: string;
	isSubmitting: boolean;
	form: AbilityFormScreenForm;
	subjects: AbilityFormScreenOption[];
	actions: AbilityFormScreenOption[];
	onClickBackButton: () => void;
	onClickSubmitButton: () => void;
	onChange: AbilityFormScreenChangeHandlers;
};
export type AbilityFormScreenProps =
	| AbilityFormScreenLoadingProps
	| AbilityFormScreenNotFoundProps
	| AbilityFormScreenReadyProps;
export const AbilityFormScreen = observer((props: AbilityFormScreenProps) => {
	if (props.status === "loading") {
		return (
			<VStack gap="section" fullWidth>
				<PageTitleBar title={props.title} description="로딩 중..." />

				<SectionSurface>
					<div className="flex items-center justify-center gap-2 p-8">
						<Spinner size="sm" />
						<span className="text-muted">로딩 중...</span>
					</div>
				</SectionSurface>
			</VStack>
		);
	}
	if (props.status === "not_found") {
		return (
			<VStack gap="section" fullWidth>
				<PageTitleBar
					title={props.title}
					description="권한을 찾을 수 없습니다."
				/>

				<SectionSurface>
					<div className="flex flex-col items-center justify-center gap-4 p-8">
						<p className="text-muted">권한을 찾을 수 없습니다.</p>
						<Button variant="flat" onPress={props.onClickNotFoundBackButton}>
							목록으로
						</Button>
					</div>
				</SectionSurface>
			</VStack>
		);
	}
	const isEditMode = props.mode === "edit";
	return (
		<VStack gap="section" fullWidth>
			<PageTitleBar
				title={props.title}
				description={props.description}
				actions={
					<div className="flex gap-2">
						<Button
							variant="flat"
							startContent={<ArrowLeft className="h-4 w-4" />}
							onPress={props.onClickBackButton}
						>
							{props.backButtonLabel}
						</Button>
						<Button
							color="primary"
							startContent={<Save className="h-4 w-4" />}
							onPress={props.onClickSubmitButton}
							isLoading={props.isSubmitting}
						>
							{props.submitButtonLabel}
						</Button>
					</div>
				}
			/>

			<SectionSurface>
				<VStack gap="section">
					<SectionSurface top={<PageTitleBar level={2} title="기본 정보" />}>
						<div className="grid grid-cols-1 gap-4">
							<Input
								label="권한 이름"
								placeholder="예: manage_users"
								value={props.form.name}
								onValueChange={props.onChange.onChangeName}
								isRequired={!isEditMode}
								isReadOnly={isEditMode}
								description={
									isEditMode ? "권한 이름은 수정할 수 없습니다." : undefined
								}
							/>
							<TextArea
								label="설명"
								placeholder="권한에 대한 설명을 입력하세요"
								value={props.form.description}
								onValueChange={props.onChange.onChangeDescription}
								minRows={2}
							/>
						</div>
					</SectionSurface>
					<SectionSurface top={<PageTitleBar level={2} title="CASL 정보" />}>
						<div className="grid grid-cols-1 gap-4">
							<Select
								label="Subject"
								placeholder="Subject를 선택하세요"
								value={props.form.subjectId || null}
								onChange={(value) => {
									props.onChange.onChangeSubjectId(String(value ?? ""));
								}}
								isRequired={!isEditMode}
							>
								{props.subjects.map((subject) => (
									<ListBox.Item
										key={subject.id}
										id={subject.id}
										textValue={subject.label}
									>
										{subject.label}
									</ListBox.Item>
								))}
							</Select>
							<Select
								label="Action"
								placeholder="Action을 선택하세요"
								value={props.form.actionId || null}
								onChange={(value) => {
									props.onChange.onChangeActionId(String(value ?? ""));
								}}
								isRequired={!isEditMode}
							>
								{props.actions.map((action) => (
									<ListBox.Item
										key={action.id}
										id={action.id}
										textValue={action.label}
									>
										{action.label}
									</ListBox.Item>
								))}
							</Select>
							<TextArea
								label="Fields"
								placeholder="쉼표로 구분하여 필드를 입력하세요. 예: name, email, phone (빈 값 = 전체 필드)"
								value={props.form.fields}
								onValueChange={props.onChange.onChangeFields}
								minRows={2}
								description="빈 값이면 전체 필드에 대한 권한입니다."
							/>
							<TextArea
								label="Conditions (JSON)"
								placeholder='{"userId": "{{ user.id }}"}'
								value={props.form.conditions}
								onValueChange={props.onChange.onChangeConditions}
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
								<Switch
									isSelected={props.form.inverted}
									onValueChange={props.onChange.onChangeInverted}
								/>
							</div>
							{props.form.inverted ? (
								<TextArea
									label="거부 사유"
									placeholder="권한을 거부하는 이유를 입력하세요"
									value={props.form.reason}
									onValueChange={props.onChange.onChangeReason}
									minRows={2}
								/>
							) : null}
						</div>
					</SectionSurface>
				</VStack>
			</SectionSurface>
		</VStack>
	);
});
AbilityFormScreen.displayName = "AbilityFormScreen";
