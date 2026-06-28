"use client";

import {
	Button,
	CONTENT_LANGUAGE_OPTIONS,
	Input,
	PageTitleBar,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { Select } from "../../selection/Select/Select";
export interface SpaceCreateScreenProps {
	name: string;
	label: string;
	address: string;
	phone: string;
	email: string;
	businessNo: string;
	contentLanguageCode: string;
	errors: Record<string, string>;
	isSubmitPending: boolean;
	onChangeNameInput: (value: string) => void;
	onChangeLabelInput: (value: string) => void;
	onChangeAddressInput: (value: string) => void;
	onChangePhoneInput: (value: string) => void;
	onChangeEmailInput: (value: string) => void;
	onChangeBusinessNoInput: (value: string) => void;
	onChangeContentLanguageSelect: (value: string) => void;
	onClickCancelButton: () => void;
	onClickSaveButton: () => void;
}
export const SpaceCreateScreen = observer(
	({
		name,
		label,
		address,
		phone,
		email,
		businessNo,
		contentLanguageCode,
		errors,
		isSubmitPending,
		onChangeNameInput,
		onChangeLabelInput,
		onChangeAddressInput,
		onChangePhoneInput,
		onChangeEmailInput,
		onChangeBusinessNoInput,
		onChangeContentLanguageSelect,
		onClickCancelButton,
		onClickSaveButton,
	}: SpaceCreateScreenProps) => {
		return (
			<VStack gap="section" fullWidth>
				<PageTitleBar
					title="공간 등록"
					description="새로운 공간과 시설 detail을 등록합니다."
				/>
				<SectionSurface>
					<Section>
						<Section.Body>
							<VStack gap={4}>
								<Section>
									<Section.Header>
										<PageTitleBar level={2} title="기본 정보" />
									</Section.Header>
									<Section.Body>
										<VStack gap={4}>
											<Input
												label="시설명"
												placeholder="시설명을 입력하세요"
												value={name}
												onValueChange={onChangeNameInput}
												isRequired
												isInvalid={Boolean(errors.name)}
												errorMessage={errors.name}
											/>
											<Input
												label="라벨"
												placeholder="단축 라벨을 입력하세요 (선택)"
												value={label}
												onValueChange={onChangeLabelInput}
											/>
											<Input
												label="주소"
												placeholder="주소를 입력하세요"
												value={address}
												onValueChange={onChangeAddressInput}
												isRequired
												isInvalid={Boolean(errors.address)}
												errorMessage={errors.address}
											/>
											<Input
												label="전화번호"
												placeholder="전화번호를 입력하세요"
												type="tel"
												value={phone}
												onValueChange={onChangePhoneInput}
												isRequired
												isInvalid={Boolean(errors.phone)}
												errorMessage={errors.phone}
											/>
											<Input
												label="이메일"
												placeholder="이메일을 입력하세요"
												type="email"
												value={email}
												onValueChange={onChangeEmailInput}
												isRequired
												isInvalid={Boolean(errors.email)}
												errorMessage={errors.email}
											/>
											<Input
												label="사업자등록번호"
												placeholder="000-00-00000"
												value={businessNo}
												onValueChange={onChangeBusinessNoInput}
												isRequired
												isInvalid={Boolean(errors.businessNo)}
												errorMessage={errors.businessNo}
											/>
											<Select
												label="콘텐츠 언어"
												placeholder="운영 리소스 작성 언어를 선택하세요"
												value={contentLanguageCode}
												onChange={(value) =>
													onChangeContentLanguageSelect(String(value ?? ""))
												}
												options={CONTENT_LANGUAGE_OPTIONS.map((language) => ({
													value: language.code,
													label: language.label,
												}))}
												isRequired
												isInvalid={Boolean(errors.contentLanguageCode)}
												errorMessage={errors.contentLanguageCode}
											/>
										</VStack>
									</Section.Body>
								</Section>
								<div className="mt-4 flex justify-end gap-2">
									<Button
										variant="flat"
										onPress={onClickCancelButton}
										isDisabled={isSubmitPending}
									>
										취소
									</Button>
									<Button
										color="primary"
										onPress={onClickSaveButton}
										isLoading={isSubmitPending}
									>
										등록
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
