"use client";

import {
	FormPage,
	FormPageSurface,
	FormSection,
	FormSectionCard,
	PageTitleBar,
	VStack,
} from "@cocrepo/ui";
import { Button, Input, Switch } from "@heroui/react";
import { Save } from "lucide-react";
import { observer } from "mobx-react-lite";

/** 숫자 필드 키 타입 */
type NumberField =
	| "passwordMinLength"
	| "passwordExpirationDays"
	| "passwordReuseLimit"
	| "temporaryLockThreshold"
	| "temporaryLockDurationMin"
	| "permanentLockThreshold"
	| "accessTokenTtlSec"
	| "refreshTokenTtlSec"
	| "sessionTtlSec";

export interface SecurityPolicyFormPagePolicy {
	passwordMinLength: number;
	passwordRequireUppercase: boolean;
	passwordRequireLowercase: boolean;
	passwordRequireNumber: boolean;
	passwordRequireSpecial: boolean;
	passwordExpirationDays: number;
	passwordReuseLimit: number;
	temporaryLockThreshold: number;
	temporaryLockDurationMin: number;
	permanentLockThreshold: number;
	accessTokenTtlSec: number;
	refreshTokenTtlSec: number;
	sessionTtlSec: number;
}

export interface SecurityPolicyFormPageSubmitInput
	extends SecurityPolicyFormPagePolicy {}

export interface SecurityPolicyFormPageFormState
	extends SecurityPolicyFormPagePolicy {}

export interface SecurityPolicyFormPageProps {
	formState: SecurityPolicyFormPageFormState;
	isSaving: boolean;
	isSaveSuccess: boolean;
	onChangeNumberField: (field: NumberField, value: string) => void;
	onChangeBooleanField: (
		field:
			| "passwordRequireUppercase"
			| "passwordRequireLowercase"
			| "passwordRequireNumber"
			| "passwordRequireSpecial",
		value: boolean,
	) => void;
	onSubmit: () => void;
}

/**
 * 보안 정책 설정 pure page입니다.
 */
export const SecurityPolicyFormPage = observer(({
		formState,
		isSaving,
		isSaveSuccess,
		onChangeNumberField,
		onChangeBooleanField,
		onSubmit,
	}: SecurityPolicyFormPageProps) => {
		return (
			<FormPage
				top={
					<PageTitleBar
						title="보안 정책"
						description="인증 보안 정책을 관리합니다."
						actions={
							<Button
								color={isSaveSuccess ? "success" : "primary"}
								startContent={<Save className="h-4 w-4" />}
								onPress={onSubmit}
								isLoading={isSaving}
							>
								{isSaveSuccess ? "저장 완료" : "저장"}
							</Button>
						}
					/>
				}
			>
				<FormPageSurface>
					<VStack gap={4}>
						<FormSectionCard>
							<FormSection
								top={
									<PageTitleBar
										level={2}
										title="비밀번호 정책"
										description="비밀번호 생성 규칙 및 만료 정책을 설정합니다."
									/>
								}
							>
								<VStack gap={5}>
									<Input
										type="number"
										label="최소 길이"
										description="비밀번호의 최소 문자 수 (4~32)"
										min={4}
										max={32}
										value={String(formState.passwordMinLength)}
										onValueChange={(value) =>
											onChangeNumberField("passwordMinLength", value)
										}
										className="max-w-xs"
									/>
									<VStack gap={4}>
										<Switch
											isSelected={formState.passwordRequireUppercase}
											onValueChange={(value) => {
												onChangeBooleanField("passwordRequireUppercase", value);
											}}
										>
											<div>
												<p className="text-sm font-medium">대문자 필수</p>
												<p className="text-xs text-default-400">
													영문 대문자(A-Z)를 1자 이상 포함해야 합니다
												</p>
											</div>
										</Switch>
										<Switch
											isSelected={formState.passwordRequireLowercase}
											onValueChange={(value) => {
												onChangeBooleanField("passwordRequireLowercase", value);
											}}
										>
											<div>
												<p className="text-sm font-medium">소문자 필수</p>
												<p className="text-xs text-default-400">
													영문 소문자(a-z)를 1자 이상 포함해야 합니다
												</p>
											</div>
										</Switch>
										<Switch
											isSelected={formState.passwordRequireNumber}
											onValueChange={(value) => {
												onChangeBooleanField("passwordRequireNumber", value);
											}}
										>
											<div>
												<p className="text-sm font-medium">숫자 필수</p>
												<p className="text-xs text-default-400">
													숫자(0-9)를 1자 이상 포함해야 합니다
												</p>
											</div>
										</Switch>
										<Switch
											isSelected={formState.passwordRequireSpecial}
											onValueChange={(value) => {
												onChangeBooleanField("passwordRequireSpecial", value);
											}}
										>
											<div>
												<p className="text-sm font-medium">특수문자 필수</p>
												<p className="text-xs text-default-400">
													특수문자(!@#$%^&* 등)를 1자 이상 포함해야 합니다
												</p>
											</div>
										</Switch>
									</VStack>
									<Input
										type="number"
										label="비밀번호 만료일 (일)"
										description="0으로 설정하면 비밀번호가 만료되지 않습니다"
										min={0}
										value={String(formState.passwordExpirationDays)}
										onValueChange={(value) =>
											onChangeNumberField("passwordExpirationDays", value)
										}
										className="max-w-xs"
									/>
									<Input
										type="number"
										label="재사용 제한 횟수"
										description="최근 N개의 비밀번호를 재사용할 수 없습니다 (0=제한 없음)"
										min={0}
										value={String(formState.passwordReuseLimit)}
										onValueChange={(value) =>
											onChangeNumberField("passwordReuseLimit", value)
										}
										className="max-w-xs"
									/>
								</VStack>
							</FormSection>
						</FormSectionCard>
						<FormSectionCard>
							<FormSection
								top={
									<PageTitleBar
										level={2}
										title="잠금 정책"
										description="로그인 실패 시 계정 잠금 조건을 설정합니다."
									/>
								}
							>
								<VStack gap={5}>
									<Input
										type="number"
										label="일시 잠금 임계값 (회)"
										description="연속 로그인 실패 시 일시 잠금되는 횟수"
										min={1}
										value={String(formState.temporaryLockThreshold)}
										onValueChange={(value) =>
											onChangeNumberField("temporaryLockThreshold", value)
										}
										className="max-w-xs"
									/>
									<Input
										type="number"
										label="일시 잠금 지속시간 (분)"
										description="일시 잠금 후 자동 해제까지의 시간"
										min={1}
										value={String(formState.temporaryLockDurationMin)}
										onValueChange={(value) =>
											onChangeNumberField("temporaryLockDurationMin", value)
										}
										className="max-w-xs"
									/>
									<Input
										type="number"
										label="영구 잠금 임계값 (회)"
										description="연속 로그인 실패 시 영구 잠금되는 횟수 (관리자만 해제 가능)"
										min={1}
										value={String(formState.permanentLockThreshold)}
										onValueChange={(value) =>
											onChangeNumberField("permanentLockThreshold", value)
										}
										className="max-w-xs"
									/>
								</VStack>
							</FormSection>
						</FormSectionCard>
						<FormSectionCard>
							<FormSection
								top={
									<PageTitleBar
										level={2}
										title="세션 정책"
										description="토큰 및 세션의 유효 기간을 설정합니다."
									/>
								}
							>
								<VStack gap={5}>
									<Input
										type="number"
										label="Access Token TTL (초)"
										description="Access Token의 유효 시간 (초 단위)"
										min={60}
										value={String(formState.accessTokenTtlSec)}
										onValueChange={(value) =>
											onChangeNumberField("accessTokenTtlSec", value)
										}
										className="max-w-xs"
									/>
									<Input
										type="number"
										label="Refresh Token TTL (초)"
										description="Refresh Token의 유효 시간 (초 단위)"
										min={60}
										value={String(formState.refreshTokenTtlSec)}
										onValueChange={(value) =>
											onChangeNumberField("refreshTokenTtlSec", value)
										}
										className="max-w-xs"
									/>
									<Input
										type="number"
										label="세션 TTL (초)"
										description="사용자 세션의 유효 시간 (초 단위)"
										min={60}
										value={String(formState.sessionTtlSec)}
										onValueChange={(value) =>
											onChangeNumberField("sessionTtlSec", value)
										}
										className="max-w-xs"
									/>
								</VStack>
							</FormSection>
						</FormSectionCard>
					</VStack>
				</FormPageSurface>
			</FormPage>
		);
	});
