"use client";

import { FormPage, FormPageSurface, ContentLanguageNotice, PageTitleBar, FormSection, FormSectionCard, VStack, Button, Input, TextArea } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";

export interface TimelineCreatePageProps {
	name: string;
	description: string;
	contentLanguageCode?: string | null;
	nameError?: string;
	descriptionError?: string;
	isSubmitPending: boolean;
	isSubmitDisabled: boolean;
	onChangeNameInput: (value: string) => void;
	onChangeDescriptionTextArea: (value: string) => void;
	onClickCancelButton: () => void;
	onClickSubmitButton: () => void;
}

export const TimelineCreatePage = observer(
	({
		name,
		description,
		contentLanguageCode,
		nameError,
		descriptionError,
		isSubmitPending,
		isSubmitDisabled,
		onChangeNameInput,
		onChangeDescriptionTextArea,
		onClickCancelButton,
		onClickSubmitButton,
	}: TimelineCreatePageProps) => {
		return (
			<FormPage
				top={
					<PageTitleBar
						title="타임라인 등록"
						description="새 타임라인을 등록합니다."
						actions={
							<Button variant="flat" onPress={onClickCancelButton}>
								취소
							</Button>
						}
					/>
				}
			>
				<FormPageSurface>
					<FormSectionCard>
						<FormSection>
							<VStack gap={4}>
								<ContentLanguageNotice
									contentLanguageCode={contentLanguageCode}
								/>
								<Input
									label="타임라인명"
									labelPlacement="outside"
									placeholder="예: 2025년 가을 시즌, 10월 1주차"
									value={name}
									onValueChange={onChangeNameInput}
									isRequired
									isInvalid={Boolean(nameError)}
									errorMessage={nameError}
								/>
								<TextArea
									label="설명"
									labelPlacement="outside"
									placeholder="타임라인에 대한 부가 설명을 입력하세요."
									value={description}
									onValueChange={onChangeDescriptionTextArea}
									maxLength={500}
									description={`${description.length} / 500`}
									isInvalid={Boolean(descriptionError)}
									errorMessage={descriptionError}
								/>
								<div className="flex justify-end">
									<Button
										color="primary"
										onPress={onClickSubmitButton}
										isLoading={isSubmitPending}
										isDisabled={isSubmitDisabled}
									>
										등록
									</Button>
								</div>
							</VStack>
						</FormSection>
					</FormSectionCard>
				</FormPageSurface>
			</FormPage>
		);
	},
);
