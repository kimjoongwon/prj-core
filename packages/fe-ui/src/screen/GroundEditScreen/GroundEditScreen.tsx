"use client";

import {
	Button,
	CONTENT_LANGUAGE_OPTIONS,
	Input,
	PageTitleBar,
	Section,
	SectionSurface,
	useT,
	VStack,
} from "@cocrepo/ui";
import { Spinner } from "@heroui/react";
import { observer } from "mobx-react-lite";
import { Select } from "../../selection/Select/Select";
export interface GroundEditScreenProps {
	groundName?: string;
	name: string;
	label: string;
	address: string;
	phone: string;
	email: string;
	businessNo: string;
	contentLanguageCode: string;
	errors: Record<string, string>;
	isLoading: boolean;
	isNotFound: boolean;
	isSubmitPending: boolean;
	onChangeNameInput: (value: string) => void;
	onChangeLabelInput: (value: string) => void;
	onChangeAddressInput: (value: string) => void;
	onChangePhoneInput: (value: string) => void;
	onChangeEmailInput: (value: string) => void;
	onChangeContentLanguageSelect: (value: string) => void;
	onClickCancelButton: () => void;
	onClickSaveButton: () => void;
}
export const GroundEditScreen = observer(
	({
		groundName,
		name,
		label,
		address,
		phone,
		email,
		businessNo,
		contentLanguageCode,
		errors,
		isLoading,
		isNotFound,
		isSubmitPending,
		onChangeNameInput,
		onChangeLabelInput,
		onChangeAddressInput,
		onChangePhoneInput,
		onChangeEmailInput,
		onChangeContentLanguageSelect,
		onClickCancelButton,
		onClickSaveButton,
	}: GroundEditScreenProps) => {
		const t = useT();
		if (isLoading) {
			return (
				<VStack fullWidth>
					<PageTitleBar title="시설 정보 수정" description="로딩 중..." />
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex items-center justify-center gap-2 p-8">
									<Spinner size="sm" />
									<span className="text-muted">{t("로딩 중...")}</span>
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		if (isNotFound) {
			return (
				<VStack fullWidth>
					<PageTitleBar
						title="시설 정보 수정"
						description="시설 detail을 찾을 수 없습니다."
					/>
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex flex-col items-center justify-center gap-4 p-8">
									<p className="text-muted">
										{t("시설 detail을 찾을 수 없습니다.")}
									</p>
									<Button variant="flat" onPress={onClickCancelButton}>
										목록으로
									</Button>
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		return (
			<VStack fullWidth>
				<PageTitleBar
					title="시설 정보 수정"
					description={
						groundName ? (
							<>
								{groundName} {t("시설 detail을 수정합니다.")}
							</>
						) : (
							"시설 detail을 수정합니다."
						)
					}
				/>
				<SectionSurface>
					<Section>
						<Section.Header>
							<PageTitleBar level={2} title="기본 정보" />
						</Section.Header>
						<Section.Body>
							<VStack>
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
									value={businessNo}
									isDisabled
									description="사업자등록번호는 수정할 수 없습니다."
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
								<div className="flex justify-end gap-2 pt-4">
									<Button variant="flat" onPress={onClickCancelButton}>
										취소
									</Button>
									<Button
										color="primary"
										onPress={onClickSaveButton}
										isLoading={isSubmitPending}
									>
										저장
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
