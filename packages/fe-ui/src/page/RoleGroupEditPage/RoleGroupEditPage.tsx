"use client";

import {
	FormPage,
	FormPageSurface,
	PageTitleBar,
	FormSectionCard,
	VStack,
} from "@cocrepo/ui";
import { Button, Input } from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
import { observer } from "mobx-react-lite";

export interface RoleGroupEditPageProps {
	groupName?: string;
	name: string;
	label: string;
	nameError?: string;
	isLoading: boolean;
	isSubmitting: boolean;
	isNotFound: boolean;
	onChangeNameInput: (value: string) => void;
	onChangeLabelInput: (value: string) => void;
	onClickBackButton: () => void;
	onClickListButton: () => void;
	onClickSubmitButton: () => void;
}

export const RoleGroupEditPage = observer(
	({
		groupName,
		name,
		label,
		nameError,
		isLoading,
		isSubmitting,
		isNotFound,
		onChangeNameInput,
		onChangeLabelInput,
		onClickBackButton,
		onClickListButton,
		onClickSubmitButton,
	}: RoleGroupEditPageProps) => {
		if (isLoading) {
			return (
				<FormPage
					top={<PageTitleBar title="역할 그룹 수정" description="로딩 중..." />}
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
							title="역할 그룹 수정"
							description="그룹을 찾을 수 없습니다."
						/>
					}
				>
					<FormPageSurface>
						<FormSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-default-500">그룹을 찾을 수 없습니다.</p>
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
						title="역할 그룹 수정"
						description={
							groupName ? `${groupName} 그룹을 수정합니다.` : "그룹을 수정합니다."
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
									label="그룹명"
									value={name}
									onValueChange={onChangeNameInput}
									isInvalid={Boolean(nameError)}
									errorMessage={nameError}
									isRequired
									maxLength={50}
								/>
								<Input
									label="라벨"
									placeholder="표시 라벨"
									value={label}
									onValueChange={onChangeLabelInput}
									maxLength={100}
									description="그룹의 표시 라벨입니다."
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
