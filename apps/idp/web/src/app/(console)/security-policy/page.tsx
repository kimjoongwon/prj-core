"use client";

import {
	getGetSecurityPolicyQueryKey,
	useGetSecurityPolicy,
	useUpdateSecurityPolicy,
} from "@cocrepo/api/idp/security-policy";
import {
	FormPage,
	FormPageSurface,
	FormSection,
	FormSectionCard,
	PageTitleBar,
	VStack,
} from "@cocrepo/ui";
import { Button, Input, Switch } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { Save } from "lucide-react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

function SecurityPolicyPage() {
	return <SecurityPolicyPageClient />;
}

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

interface SecurityPolicyFormState {
	// 비밀번호 정책
	passwordMinLength: number;
	passwordRequireUppercase: boolean;
	passwordRequireLowercase: boolean;
	passwordRequireNumber: boolean;
	passwordRequireSpecial: boolean;
	passwordExpirationDays: number;
	passwordReuseLimit: number;
	// 잠금 정책
	temporaryLockThreshold: number;
	temporaryLockDurationMin: number;
	permanentLockThreshold: number;
	// 세션 정책
	accessTokenTtlSec: number;
	refreshTokenTtlSec: number;
	sessionTtlSec: number;
	// 상태 관리
	isInitialized: boolean;
	isSaveSuccess: boolean;
}

/**
 * 보안 정책 설정 페이지 - 클라이언트 컴포넌트
 */
function SecurityPolicyPageClient() {
	const queryClient = useQueryClient();

	const { data: response } = useGetSecurityPolicy();
	const policy = response?.data;

	const { mutate: updatePolicy, isPending } = useUpdateSecurityPolicy({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: getGetSecurityPolicyQueryKey(),
				});
				state.isSaveSuccess = true;
				setTimeout(() => {
					state.isSaveSuccess = false;
				}, 3000);
			},
		},
	});

	const state = useLocalObservable<SecurityPolicyFormState>(() => ({
		passwordMinLength: 8,
		passwordRequireUppercase: false,
		passwordRequireLowercase: false,
		passwordRequireNumber: false,
		passwordRequireSpecial: false,
		passwordExpirationDays: 0,
		passwordReuseLimit: 0,
		temporaryLockThreshold: 5,
		temporaryLockDurationMin: 30,
		permanentLockThreshold: 10,
		accessTokenTtlSec: 3600,
		refreshTokenTtlSec: 86400,
		sessionTtlSec: 86400,
		isInitialized: false,
		isSaveSuccess: false,
	}));

	// API 응답으로 폼 초기값 설정
	useEffect(() => {
		if (policy && !state.isInitialized) {
			state.passwordMinLength = policy.passwordMinLength;
			state.passwordRequireUppercase = policy.passwordRequireUppercase;
			state.passwordRequireLowercase = policy.passwordRequireLowercase;
			state.passwordRequireNumber = policy.passwordRequireNumber;
			state.passwordRequireSpecial = policy.passwordRequireSpecial;
			state.passwordExpirationDays = policy.passwordExpirationDays;
			state.passwordReuseLimit = policy.passwordReuseLimit;
			state.temporaryLockThreshold = policy.temporaryLockThreshold;
			state.temporaryLockDurationMin = policy.temporaryLockDurationMin;
			state.permanentLockThreshold = policy.permanentLockThreshold;
			state.accessTokenTtlSec = policy.accessTokenTtlSec;
			state.refreshTokenTtlSec = policy.refreshTokenTtlSec;
			state.sessionTtlSec = policy.sessionTtlSec;
			state.isInitialized = true;
		}
	}, [policy, state]);

	const onClickSaveButton = () => {
		updatePolicy({
			data: {
				passwordMinLength: state.passwordMinLength,
				passwordRequireUppercase: state.passwordRequireUppercase,
				passwordRequireLowercase: state.passwordRequireLowercase,
				passwordRequireNumber: state.passwordRequireNumber,
				passwordRequireSpecial: state.passwordRequireSpecial,
				passwordExpirationDays: state.passwordExpirationDays,
				passwordReuseLimit: state.passwordReuseLimit,
				temporaryLockThreshold: state.temporaryLockThreshold,
				temporaryLockDurationMin: state.temporaryLockDurationMin,
				permanentLockThreshold: state.permanentLockThreshold,
				accessTokenTtlSec: state.accessTokenTtlSec,
				refreshTokenTtlSec: state.refreshTokenTtlSec,
				sessionTtlSec: state.sessionTtlSec,
			},
		});
	};

	const onChangeNumberField = (field: NumberField, value: string) => {
		const num = Number(value);
		if (!Number.isNaN(num)) {
			state[field] = num;
		}
	};

	return (
		<FormPage
			top={
				<PageTitleBar
					title="보안 정책"
					description="인증 보안 정책을 관리합니다."
					actions={
						<Button
							color={state.isSaveSuccess ? "success" : "primary"}
							startContent={<Save className="h-4 w-4" />}
							onPress={onClickSaveButton}
							isLoading={isPending}
						>
							{state.isSaveSuccess ? "저장 완료" : "저장"}
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
									value={String(state.passwordMinLength)}
									onValueChange={(value) =>
										onChangeNumberField("passwordMinLength", value)
									}
									className="max-w-xs"
								/>
								<VStack gap={4}>
									<Switch
										isSelected={state.passwordRequireUppercase}
										onValueChange={(value) => {
											state.passwordRequireUppercase = value;
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
										isSelected={state.passwordRequireLowercase}
										onValueChange={(value) => {
											state.passwordRequireLowercase = value;
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
										isSelected={state.passwordRequireNumber}
										onValueChange={(value) => {
											state.passwordRequireNumber = value;
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
										isSelected={state.passwordRequireSpecial}
										onValueChange={(value) => {
											state.passwordRequireSpecial = value;
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
									value={String(state.passwordExpirationDays)}
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
									value={String(state.passwordReuseLimit)}
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
									value={String(state.temporaryLockThreshold)}
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
									value={String(state.temporaryLockDurationMin)}
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
									value={String(state.permanentLockThreshold)}
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
									value={String(state.accessTokenTtlSec)}
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
									value={String(state.refreshTokenTtlSec)}
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
									value={String(state.sessionTtlSec)}
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
}

export default observer(SecurityPolicyPage);
