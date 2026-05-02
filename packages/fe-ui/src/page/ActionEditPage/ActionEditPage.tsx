"use client";
import {
	FormPage,
	FormSectionCard,
	FormPageSurface,
	PageTitleBar,
	VStack,
} from "@cocrepo/ui";
import { Button, Input, Select, SelectItem, Textarea } from "@cocrepo/ui/heroui";
import { ArrowLeft, Save } from "lucide-react";
import { observer } from "mobx-react-lite";

export interface ActionEditPageFormState {
	displayName: string;
	description: string;
	group: string;
	order: number;
}

export interface ActionEditPageAction {
	actionId: string;
	name: string;
	displayName?: string | null;
	description?: string | null;
	group?: string | null;
	order: number;
	isSystem: boolean;
}

export interface ActionEditPageForm {
	displayName: string;
	description: string;
	group: string;
	order: number;
}

export interface ActionEditPageProps {
	action?: ActionEditPageAction;
	formState: ActionEditPageFormState;
	isLoading: boolean;
	isSubmitting: boolean;
	onClickBackButton: () => void;
	onClickListButton: () => void;
	onChangeDisplayNameInput: (value: string) => void;
	onChangeDescriptionTextarea: (value: string) => void;
	onChangeGroupSelection: (value: string) => void;
	onChangeOrderInput: (value: string) => void;
	onSubmit: (form: ActionEditPageForm) => void;
}

/**
 * group 옵션
 */
const groupOptions = [
	{ value: "crud", label: "CRUD" },
	{ value: "visibility", label: "Visibility" },
	{ value: "workflow", label: "Workflow" },
	{ value: "bulk", label: "Bulk" },
];
const GROUP_OPTION_VALUES = new Set(groupOptions.map((option) => option.value));

export const ActionEditPage = observer(
	({
		action,
		formState,
		isLoading,
		isSubmitting,
		onClickBackButton,
		onClickListButton,
		onChangeDisplayNameInput,
		onChangeDescriptionTextarea,
		onChangeGroupSelection,
		onChangeOrderInput,
		onSubmit,
	}: ActionEditPageProps) => {
		if (isLoading) {
			return (
				<FormPage
					top={<PageTitleBar title="Action 수정" description="로딩 중..." />}
				>
					<FormPageSurface>
						<FormSectionCard>
							<div className="flex items-center justify-center p-8">
								<span className="text-default-500">로딩 중...</span>
							</div>
						</FormSectionCard>
					</FormPageSurface>
				</FormPage>
			);
		}

		if (!action) {
			const pageHeader = (
				<PageTitleBar
					title="Action 수정"
					description="Action을 찾을 수 없습니다."
				/>
			);

			return (
				<FormPage top={pageHeader}>
					<FormPageSurface>
						<FormSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-default-500">Action을 찾을 수 없습니다.</p>
								<Button variant="flat" onPress={onClickListButton}>
									목록으로
								</Button>
							</div>
						</FormSectionCard>
					</FormPageSurface>
				</FormPage>
			);
		}

		if (action.isSystem) {
			const pageHeader = (
				<PageTitleBar
					title="Action 수정"
					description="시스템 Action은 수정할 수 없습니다."
				/>
			);

			return (
				<FormPage top={pageHeader}>
					<FormPageSurface>
						<FormSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-default-500">
									시스템 Action은 수정할 수 없습니다.
								</p>
								<Button variant="flat" onPress={onClickBackButton}>
									상세로 돌아가기
								</Button>
							</div>
						</FormSectionCard>
					</FormPageSurface>
				</FormPage>
			);
		}

		const onClickSubmitButton = () => {
			onSubmit({
				displayName: formState.displayName,
				description: formState.description,
				group: formState.group,
				order: formState.order,
			});
		};

		const pageHeader = (
			<PageTitleBar
				title="Action 수정"
				description={`${action.displayName || action.name} Action을 수정합니다.`}
				actions={
					<Button
						variant="light"
						startContent={<ArrowLeft className="h-4 w-4" />}
						onPress={onClickBackButton}
					>
						상세로 돌아가기
					</Button>
				}
			/>
		);

		return (
			<FormPage top={pageHeader}>
				<FormPageSurface>
					<VStack gap={4}>
						<FormSectionCard>
							<div className="space-y-6">
								<Input
									label="행위 식별자"
									value={action.name}
									isReadOnly
									isDisabled
									description="행위 식별자는 수정할 수 없습니다."
								/>
								<Input
									label="표시명"
									placeholder="이메일 마스킹 읽기"
									value={formState.displayName}
									onValueChange={onChangeDisplayNameInput}
									maxLength={100}
									description="사용자에게 보여질 Action 이름입니다."
								/>
								<Textarea
									label="설명"
									placeholder="Action에 대한 설명을 입력하세요."
									value={formState.description}
									onValueChange={onChangeDescriptionTextarea}
									maxLength={200}
									minRows={3}
								/>
								<Select
									label="분류"
									placeholder="분류를 선택하세요"
									selectedKeys={
										formState.group && GROUP_OPTION_VALUES.has(formState.group)
											? [formState.group]
											: []
									}
									onSelectionChange={(keys) => {
										const selectedKey = Array.from(keys)[0];
										onChangeGroupSelection(
											selectedKey ? String(selectedKey) : "",
										);
									}}
								>
									{groupOptions.map((option) => (
										<SelectItem key={option.value}>{option.label}</SelectItem>
									))}
								</Select>
								<Input
									label="정렬 순서"
									type="number"
									value={String(formState.order)}
									onValueChange={onChangeOrderInput}
									description="낮은 숫자일수록 먼저 표시됩니다."
								/>
								<div className="flex justify-end gap-2 pt-4">
									<Button variant="flat" onPress={onClickBackButton}>
										취소
									</Button>
									<Button
										color="primary"
										startContent={<Save className="h-4 w-4" />}
										onPress={onClickSubmitButton}
										isLoading={isSubmitting}
									>
										저장
									</Button>
								</div>
							</div>
						</FormSectionCard>
					</VStack>
				</FormPageSurface>
			</FormPage>
		);
	},
);
