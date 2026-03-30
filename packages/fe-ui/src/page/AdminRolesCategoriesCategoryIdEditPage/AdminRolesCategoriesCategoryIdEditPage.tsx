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

export interface AdminRolesCategoriesCategoryIdEditPageOption {
	id: string;
	name: string;
}

export interface AdminRolesCategoriesCategoryIdEditPageProps {
	categoryName?: string;
	name: string;
	parentId: string;
	nameError?: string;
	options: AdminRolesCategoriesCategoryIdEditPageOption[];
	isLoading: boolean;
	isSubmitting: boolean;
	isNotFound: boolean;
	onChangeNameInput: (value: string) => void;
	onChangeParentSelection: (value: string) => void;
	onClickBackButton: () => void;
	onClickListButton: () => void;
	onClickSubmitButton: () => void;
}

export const AdminRolesCategoriesCategoryIdEditPage = observer(
	({
		categoryName,
		name,
		parentId,
		nameError,
		options,
		isLoading,
		isSubmitting,
		isNotFound,
		onChangeNameInput,
		onChangeParentSelection,
		onClickBackButton,
		onClickListButton,
		onClickSubmitButton,
	}: AdminRolesCategoriesCategoryIdEditPageProps) => {
		if (isLoading) {
			return (
				<FormPage
					top={
						<PageTitleBar title="역할 카테고리 수정" description="로딩 중..." />
					}
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

		if (isNotFound) {
			return (
				<FormPage
					top={
						<PageTitleBar
							title="역할 카테고리 수정"
							description="카테고리를 찾을 수 없습니다."
						/>
					}
				>
					<FormPageSurface>
						<FormSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-default-500">카테고리를 찾을 수 없습니다.</p>
								<Button variant="flat" onPress={onClickListButton}>
									목록으로
								</Button>
							</div>
						</FormSectionCard>
					</FormPageSurface>
				</FormPage>
			);
		}

		return (
			<FormPage
				top={
					<PageTitleBar
						title="역할 카테고리 수정"
						description={
							categoryName
								? `${categoryName} 카테고리를 수정합니다.`
								: "카테고리를 수정합니다."
						}
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
				}
			>
				<FormPageSurface>
					<VStack gap={4}>
						<FormSectionCard>
							<div className="space-y-6">
								<Input
									label="카테고리명"
									value={name}
									onValueChange={onChangeNameInput}
									isInvalid={Boolean(nameError)}
									errorMessage={nameError}
									isRequired
									maxLength={50}
								/>
								<Select
									label="상위 카테고리"
									placeholder="없음 (최상위)"
									selectedKeys={parentId ? [parentId] : []}
									onSelectionChange={(keys) => {
										const selected = Array.from(keys)[0];
										onChangeParentSelection(selected ? String(selected) : "");
									}}
									description="상위 카테고리를 변경합니다. 순환 참조는 서버에서 검증됩니다."
								>
									{options.map((option) => (
										<SelectItem key={option.id}>{option.name}</SelectItem>
									))}
								</Select>
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
