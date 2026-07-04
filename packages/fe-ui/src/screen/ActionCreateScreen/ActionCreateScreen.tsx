"use client";

import { PageTitleBar, Section, SectionSurface, VStack } from "@cocrepo/ui";
import { ListBox } from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../input/Button/Button";
import { Select } from "../../input/Select/Select";
import { TextArea } from "../../input/TextArea/TextArea";
import { TextField } from "../../input/TextField/TextField";
export interface ActionCreateScreenFormState {
	name: string;
	displayName: string;
	description: string;
	group: string;
	order: number;
	errors: {
		name: string;
	};
}
export interface ActionCreateScreenForm {
	name: string;
	displayName: string;
	description: string;
	group: string;
	order: number;
}
export interface ActionCreateScreenProps {
	formState: ActionCreateScreenFormState;
	isSubmitting: boolean;
	onClickBackButton: () => void;
	onChangeNameInput: (value: string) => void;
	onChangeDisplayNameInput: (value: string) => void;
	onChangeDescriptionTextArea: (value: string) => void;
	onChangeGroupSelection: (value: string) => void;
	onChangeOrderInput: (value: string) => void;
	onSubmit: (form: ActionCreateScreenForm) => void;
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
export const ActionCreateScreen = observer(
	({
		formState,
		isSubmitting,
		onClickBackButton,
		onChangeNameInput,
		onChangeDisplayNameInput,
		onChangeDescriptionTextArea,
		onChangeGroupSelection,
		onChangeOrderInput,
		onSubmit,
	}: ActionCreateScreenProps) => {
		const onClickSubmitButton = () => {
			onSubmit({
				name: formState.name,
				displayName: formState.displayName,
				description: formState.description,
				group: formState.group,
				order: formState.order,
			});
		};
		return (
			<VStack fullWidth>
				<PageTitleBar
					title="Action 등록"
					description="새로운 Action을 등록합니다."
					actions={
						<Button
							variant="light"
							startContent={<ArrowLeft className="h-4 w-4" />}
							onPress={onClickBackButton}
						>
							목록으로
						</Button>
					}
				/>
				<SectionSurface>
					<Section>
						<Section.Body>
							<VStack>
								<div className="rounded-xl bg-accent-soft p-4 dark:bg-accent/20">
									<p className="text-sm text-accent dark:text-accent">
										<strong>참고:</strong> 행위 식별자는 소문자로 시작하고,
										소문자/숫자/콜론/밑줄만 사용할 수 있습니다. (예:
										read:masked:email)
									</p>
								</div>
								<Section>
									<Section.Body>
										<div className="space-y-6">
											<TextField
												label="행위 식별자"
												placeholder="read:masked:email"
												value={formState.name}
												onValueChange={onChangeNameInput}
												isInvalid={!!formState.errors.name}
												errorMessage={formState.errors.name}
												isRequired
												description="소문자로 시작하고, 소문자/숫자/콜론/밑줄만 사용 가능합니다."
											/>
											<TextField
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
											<TextField
												label="정렬 순서"
												type="number"
												value={String(formState.order)}
												onValueChange={onChangeOrderInput}
												description="낮은 숫자일수록 먼저 표시됩니다."
											/>
											<div className="flex justify-end pt-4">
												<Button
													color="primary"
													startContent={<Save className="h-4 w-4" />}
													onPress={onClickSubmitButton}
													isLoading={isSubmitting}
												>
													Action 등록
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
