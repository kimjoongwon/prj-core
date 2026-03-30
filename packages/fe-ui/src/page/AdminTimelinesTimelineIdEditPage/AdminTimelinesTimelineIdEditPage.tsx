"use client";

import {
	FormPage,
	FormPageSurface,
	PageTitleBar,
	FormSection,
	FormSectionCard,
	VStack,
} from "@cocrepo/ui";
import { Button, Input, Textarea } from "@heroui/react";
import { observer } from "mobx-react-lite";

export interface AdminTimelinesTimelineIdEditPageProps {
	timelineName?: string;
	name: string;
	description: string;
	nameError?: string;
	descriptionError?: string;
	isSubmitPending: boolean;
	isSubmitDisabled: boolean;
	onChangeNameInput: (value: string) => void;
	onChangeDescriptionTextarea: (value: string) => void;
	onClickCancelButton: () => void;
	onClickSubmitButton: () => void;
}

/**
 * 타임라인 수정 페이지 - pure presentational component
 */
export const AdminTimelinesTimelineIdEditPage = observer(
	({
		timelineName,
		name,
		description,
		nameError,
		descriptionError,
		isSubmitPending,
		isSubmitDisabled,
		onChangeNameInput,
		onChangeDescriptionTextarea,
		onClickCancelButton,
		onClickSubmitButton,
	}: AdminTimelinesTimelineIdEditPageProps) => {
		const pageActions = (
			<Button variant="flat" onPress={onClickCancelButton}>
				취소
			</Button>
		);

		return (
			<FormPage
				top={
					<PageTitleBar
						title="타임라인 수정"
						description={timelineName}
						actions={pageActions}
					/>
				}
			>
				<FormPageSurface>
					<FormSectionCard>
						<FormSection>
							<VStack gap={4}>
								<Input
									label="타임라인명"
									labelPlacement="outside"
									placeholder="타임라인명을 입력하세요."
									value={name}
									onValueChange={onChangeNameInput}
									isRequired
									isInvalid={Boolean(nameError)}
									errorMessage={nameError}
								/>
								<Textarea
									label="설명"
									labelPlacement="outside"
									placeholder="타임라인에 대한 부가 설명을 입력하세요."
									value={description}
									onValueChange={onChangeDescriptionTextarea}
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
										수정
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
