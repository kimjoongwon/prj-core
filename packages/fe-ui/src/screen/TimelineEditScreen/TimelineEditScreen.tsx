"use client";

import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { Input } from "../../input/Input";
import { TextArea } from "../../input/TextArea";
import { Section } from "../../layout";
import { VStack } from "../../rhythm";
import { SectionSurface } from "../../surface";
import { ContentLanguageNotice, PageTitleBar } from "../../widget";
export interface TimelineEditScreenProps {
	timelineName?: string;
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

/**
 * 타임라인 수정 페이지 - pure presentational component
 */
export const TimelineEditScreen = observer(
	({
		timelineName,
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
	}: TimelineEditScreenProps) => {
		const pageActions = (
			<Button variant="flat" onPress={onClickCancelButton}>
				취소
			</Button>
		);
		return (
			<VStack gap="section" fullWidth>
				<PageTitleBar
					title="타임라인 수정"
					description={timelineName}
					actions={pageActions}
				/>
				<SectionSurface>
					<Section>
						<Section.Body>
							<VStack gap={4}>
								<ContentLanguageNotice
									contentLanguageCode={contentLanguageCode}
								/>
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
										수정
									</Button>
								</div>
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
