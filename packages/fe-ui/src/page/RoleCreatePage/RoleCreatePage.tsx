"use client";

import {
	FormPage,
	FormPageSurface,
	PageTitleBar,
	FormSectionCard,
	VStack,
} from "@cocrepo/ui";
import { Button, Input, Textarea } from "@heroui/react";
import { ArrowLeft, Save } from "lucide-react";
import { observer } from "mobx-react-lite";

export interface RoleCreatePageProps {
	name: string;
	displayName: string;
	description: string;
	nameError?: string;
	displayNameError?: string;
	isSubmitPending: boolean;
	onChangeNameInput: (value: string) => void;
	onChangeDisplayNameInput: (value: string) => void;
	onChangeDescriptionTextarea: (value: string) => void;
	onClickBackButton: () => void;
	onClickSubmitButton: () => void;
}

export const RoleCreatePage = observer(
	({
		name,
		displayName,
		description,
		nameError,
		displayNameError,
		isSubmitPending,
		onChangeNameInput,
		onChangeDisplayNameInput,
		onChangeDescriptionTextarea,
		onClickBackButton,
		onClickSubmitButton,
	}: RoleCreatePageProps) => {
		return (
			<FormPage
				top={
					<PageTitleBar
						title="역할 등록"
						description="새로운 역할을 등록합니다."
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
						<div className="rounded-xl bg-primary-50 p-4 dark:bg-primary-900/20">
							<p className="text-sm text-primary-700 dark:text-primary-400">
								<strong>참고:</strong> 역할 식별자는 대문자로 시작하고,
								대문자/숫자/밑줄만 사용할 수 있습니다. 등록 후에는 권한 설정
								페이지에서 상세 권한을 관리할 수 있습니다.
							</p>
						</div>
						<FormSectionCard>
							<div className="space-y-6">
								<Input
									label="역할 식별자"
									placeholder="CUSTOM_ROLE"
									value={name}
									onValueChange={onChangeNameInput}
									isInvalid={Boolean(nameError)}
									errorMessage={nameError}
									isRequired
									maxLength={50}
									description="대문자로 시작하고, 대문자/숫자/밑줄만 사용 가능합니다."
								/>
								<Input
									label="표시명"
									placeholder="사용자 정의 역할"
									value={displayName}
									onValueChange={onChangeDisplayNameInput}
									isInvalid={Boolean(displayNameError)}
									errorMessage={displayNameError}
									maxLength={50}
									description="사용자에게 보여질 역할 이름입니다."
								/>
								<Textarea
									label="설명"
									placeholder="역할에 대한 설명을 입력하세요."
									value={description}
									onValueChange={onChangeDescriptionTextarea}
									maxLength={200}
									minRows={3}
								/>
								<div className="flex justify-end pt-4">
									<Button
										color="primary"
										startContent={<Save className="h-4 w-4" />}
										onPress={onClickSubmitButton}
										isLoading={isSubmitPending}
									>
										역할 등록
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
