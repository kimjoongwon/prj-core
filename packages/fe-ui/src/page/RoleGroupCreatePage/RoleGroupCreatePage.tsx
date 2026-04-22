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

export interface RoleGroupCreatePageProps {
	name: string;
	label: string;
	nameError?: string;
	isSubmitting: boolean;
	onChangeNameInput: (value: string) => void;
	onChangeLabelInput: (value: string) => void;
	onClickBackButton: () => void;
	onClickSubmitButton: () => void;
}

export const RoleGroupCreatePage = observer(
	({
		name,
		label,
		nameError,
		isSubmitting,
		onChangeNameInput,
		onChangeLabelInput,
		onClickBackButton,
		onClickSubmitButton,
	}: RoleGroupCreatePageProps) => {
		return (
			<FormPage
				top={
					<PageTitleBar
						title="역할 그룹 등록"
						description="새로운 역할 그룹을 등록합니다."
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
									label="그룹명"
									placeholder="TRUSTED"
									value={name}
									onValueChange={onChangeNameInput}
									isInvalid={Boolean(nameError)}
									errorMessage={nameError}
									isRequired
									maxLength={50}
									description="대문자로 입력하는 것을 권장합니다. (예: TRUSTED, STANDARD)"
								/>
								<Input
									label="라벨"
									placeholder="신뢰"
									value={label}
									onValueChange={onChangeLabelInput}
									maxLength={100}
									description="그룹의 표시 라벨입니다."
								/>
								<div className="flex justify-end pt-4">
									<Button
										color="primary"
										startContent={<Save className="h-4 w-4" />}
										onPress={onClickSubmitButton}
										isLoading={isSubmitting}
									>
										그룹 등록
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
