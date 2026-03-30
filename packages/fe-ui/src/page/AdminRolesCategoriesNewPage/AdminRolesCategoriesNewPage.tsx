"use client";

import {
	FormPage,
	FormPageSurface,
	PageTitleBar,
	FormSectionCard,
	VStack,
} from "@cocrepo/ui";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
import { observer } from "mobx-react-lite";

export interface AdminRolesCategoriesNewPageOption {
	id: string;
	name: string;
}

export interface AdminRolesCategoriesNewPageProps {
	name: string;
	parentId: string;
	nameError?: string;
	options: AdminRolesCategoriesNewPageOption[];
	isSubmitting: boolean;
	onChangeNameInput: (value: string) => void;
	onChangeParentSelection: (value: string) => void;
	onClickBackButton: () => void;
	onClickSubmitButton: () => void;
}

export const AdminRolesCategoriesNewPage = observer(
	({
		name,
		parentId,
		nameError,
		options,
		isSubmitting,
		onChangeNameInput,
		onChangeParentSelection,
		onClickBackButton,
		onClickSubmitButton,
	}: AdminRolesCategoriesNewPageProps) => {
		return (
			<FormPage
				top={
					<PageTitleBar
						title="역할 카테고리 등록"
						description="새로운 역할 카테고리를 등록합니다."
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
				}
			>
				<FormPageSurface>
					<VStack gap={4}>
						<FormSectionCard>
							<div className="space-y-6">
								<Input
									label="카테고리명"
									placeholder="PLATFORM"
									value={name}
									onValueChange={onChangeNameInput}
									isInvalid={Boolean(nameError)}
									errorMessage={nameError}
									isRequired
									maxLength={50}
									description="대문자로 입력하는 것을 권장합니다. (예: PLATFORM, WORKSPACE)"
								/>
								<Select
									label="상위 카테고리"
									placeholder="없음 (최상위)"
									selectedKeys={parentId ? [parentId] : []}
									onSelectionChange={(keys) => {
										const selected = Array.from(keys)[0];
										onChangeParentSelection(selected ? String(selected) : "");
									}}
									description="상위 카테고리를 선택합니다. 선택하지 않으면 최상위 카테고리로 등록됩니다."
								>
									{options.map((option) => (
										<SelectItem key={option.id}>{option.name}</SelectItem>
									))}
								</Select>
								<div className="flex justify-end pt-4">
									<Button
										color="primary"
										startContent={<Save className="h-4 w-4" />}
										onPress={onClickSubmitButton}
										isLoading={isSubmitting}
									>
										카테고리 등록
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
