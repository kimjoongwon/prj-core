"use client";

import { PageTitleBar, Section, SectionSurface, VStack } from "@cocrepo/ui";
import { ListBox } from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Input } from "../../input/Input/Input";
import { TextArea } from "../../input/TextArea/TextArea";
import { Select } from "../../selection/Select/Select";
export interface ActionEditScreenFormState {
	displayName: string;
	description: string;
	group: string;
	order: number;
}
export interface ActionEditScreenAction {
	actionId: string;
	name: string;
	displayName?: string | null;
	description?: string | null;
	group?: string | null;
	order: number;
	isSystem: boolean;
}
export interface ActionEditScreenForm {
	displayName: string;
	description: string;
	group: string;
	order: number;
}
export interface ActionEditScreenProps {
	action?: ActionEditScreenAction;
	formState: ActionEditScreenFormState;
	isLoading: boolean;
	isSubmitting: boolean;
	onClickBackButton: () => void;
	onClickListButton: () => void;
	onChangeDisplayNameInput: (value: string) => void;
	onChangeDescriptionTextArea: (value: string) => void;
	onChangeGroupSelection: (value: string) => void;
	onChangeOrderInput: (value: string) => void;
	onSubmit: (form: ActionEditScreenForm) => void;
}

/**
 * group 옵션
 */
const groupOptions = [
	{
		value: "crud",
		label: "CRUD",
	},
	{
		value: "visibility",
		label: "Visibility",
	},
	{
		value: "workflow",
		label: "Workflow",
	},
	{
		value: "bulk",
		label: "Bulk",
	},
];
const GROUP_OPTION_VALUES = new Set(groupOptions.map((option) => option.value));
export const ActionEditScreen = observer(
	({
		action,
		formState,
		isLoading,
		isSubmitting,
		onClickBackButton,
		onClickListButton,
		onChangeDisplayNameInput,
		onChangeDescriptionTextArea,
		onChangeGroupSelection,
		onChangeOrderInput,
		onSubmit,
	}: ActionEditScreenProps) => {
		if (isLoading) {
			return (
				<VStack fullWidth>
					<PageTitleBar title="Action 수정" description="로딩 중..." />
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex items-center justify-center p-8">
									<span className="text-muted">로딩 중...</span>
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
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
				<VStack fullWidth>
					{pageHeader}
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex flex-col items-center justify-center gap-4 p-8">
									<p className="text-muted">Action을 찾을 수 없습니다.</p>
									<Button variant="flat" onPress={onClickListButton}>
										목록으로
									</Button>
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
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
				<VStack fullWidth>
					{pageHeader}
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex flex-col items-center justify-center gap-4 p-8">
									<p className="text-muted">
										시스템 Action은 수정할 수 없습니다.
									</p>
									<Button variant="flat" onPress={onClickBackButton}>
										상세로 돌아가기
									</Button>
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
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
			<VStack fullWidth>
				{pageHeader}
				<SectionSurface>
					<Section>
						<Section.Body>
							<VStack>
								<Section>
									<Section.Body>
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
											<TextArea
												label="설명"
												placeholder="Action에 대한 설명을 입력하세요."
												value={formState.description}
												onValueChange={onChangeDescriptionTextArea}
												maxLength={200}
												minRows={3}
											/>
											<Select
												label="분류"
												placeholder="분류를 선택하세요"
												value={
													formState.group &&
													GROUP_OPTION_VALUES.has(formState.group)
														? formState.group
														: null
												}
												onChange={(value) => {
													onChangeGroupSelection(String(value ?? ""));
												}}
											>
												{groupOptions.map((option) => (
													<ListBox.Item
														key={option.value}
														id={option.value}
														textValue={option.label}
													>
														{option.label}
													</ListBox.Item>
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
									</Section.Body>
								</Section>
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
