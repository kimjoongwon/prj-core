"use client";

import {
	FormPage,
	FormPageSurface,
	FormSectionCard,
	PageTitleBar,
	VStack,
} from "@cocrepo/ui";
import { ArrowLeft, Save } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button, Input, Textarea } from "../../design-system/primitives";

export interface RoleEditPageProps {
	roleName?: string;
	roleDisplayName?: string;
	isSystemRole: boolean;
	displayName: string;
	description: string;
	displayNameError?: string;
	isLoading: boolean;
	isNotFound: boolean;
	isSubmitPending: boolean;
	onChangeDisplayNameInput: (value: string) => void;
	onChangeDescriptionTextarea: (value: string) => void;
	onClickBackButton: () => void;
	onClickListButton: () => void;
	onClickSubmitButton: () => void;
}

export const RoleEditPage = observer(
	({
		roleName,
		roleDisplayName,
		isSystemRole,
		displayName,
		description,
		displayNameError,
		isLoading,
		isNotFound,
		isSubmitPending,
		onChangeDisplayNameInput,
		onChangeDescriptionTextarea,
		onClickBackButton,
		onClickListButton,
		onClickSubmitButton,
	}: RoleEditPageProps) => {
		if (isLoading) {
			return (
				<FormPage
					top={<PageTitleBar title="역할 수정" description="로딩 중..." />}
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
							title="역할 수정"
							description="역할을 찾을 수 없습니다."
						/>
					}
				>
					<FormPageSurface>
						<FormSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-default-500">역할을 찾을 수 없습니다.</p>
								<Button variant="flat" onPress={onClickListButton}>
									목록으로
								</Button>
							</div>
						</FormSectionCard>
					</FormPageSurface>
				</FormPage>
			);
		}

		if (isSystemRole) {
			return (
				<FormPage
					top={
						<PageTitleBar
							title="역할 수정"
							description="시스템 역할은 수정할 수 없습니다."
						/>
					}
				>
					<FormPageSurface>
						<FormSectionCard>
							<div className="flex flex-col items-center justify-center gap-4 p-8">
								<p className="text-default-500">
									시스템 역할은 수정할 수 없습니다.
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

		return (
			<FormPage
				top={
					<PageTitleBar
						title="역할 수정"
						description={`${roleDisplayName || roleName || ""} 역할을 수정합니다.`}
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
									label="역할 식별자"
									value={roleName}
									isReadOnly
									isDisabled
									description="역할 식별자는 수정할 수 없습니다."
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
								<div className="flex justify-end gap-2 pt-4">
									<Button variant="flat" onPress={onClickBackButton}>
										취소
									</Button>
									<Button
										color="primary"
										startContent={<Save className="h-4 w-4" />}
										onPress={onClickSubmitButton}
										isLoading={isSubmitPending}
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
