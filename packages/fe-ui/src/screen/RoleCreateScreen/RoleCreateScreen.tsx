"use client";

import { PageTitleBar, Section, SectionSurface, VStack } from "@cocrepo/ui";
import { ArrowLeft, Save } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../input/Button/Button";
import { TextArea } from "../../input/TextArea/TextArea";
import { TextField } from "../../input/TextField/TextField";
export interface RoleCreateScreenProps {
	name: string;
	displayName: string;
	description: string;
	nameError?: string;
	displayNameError?: string;
	isSubmitPending: boolean;
	onChangeNameInput: (value: string) => void;
	onChangeDisplayNameInput: (value: string) => void;
	onChangeDescriptionTextArea: (value: string) => void;
	onClickBackButton: () => void;
	onClickSubmitButton: () => void;
}
export const RoleCreateScreen = observer(
	({
		name,
		displayName,
		description,
		nameError,
		displayNameError,
		isSubmitPending,
		onChangeNameInput,
		onChangeDisplayNameInput,
		onChangeDescriptionTextArea,
		onClickBackButton,
		onClickSubmitButton,
	}: RoleCreateScreenProps) => {
		return (
			<VStack fullWidth>
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
				<SectionSurface>
					<Section>
						<Section.Body>
							<VStack>
								<div className="rounded-xl bg-accent-soft p-4 dark:bg-accent/20">
									<p className="text-sm text-accent dark:text-accent">
										<strong>참고:</strong> 역할 식별자는 대문자로 시작하고,
										대문자/숫자/밑줄만 사용할 수 있습니다. 등록 후에는 권한 설정
										페이지에서 상세 권한을 관리할 수 있습니다.
									</p>
								</div>
								<Section>
									<Section.Body>
										<div className="space-y-6">
											<TextField
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
											<TextField
												label="표시명"
												placeholder="사용자 정의 역할"
												value={displayName}
												onValueChange={onChangeDisplayNameInput}
												isInvalid={Boolean(displayNameError)}
												errorMessage={displayNameError}
												maxLength={50}
												description="사용자에게 보여질 역할 이름입니다."
											/>
											<TextArea
												label="설명"
												placeholder="역할에 대한 설명을 입력하세요."
												value={description}
												onValueChange={onChangeDescriptionTextArea}
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
