"use client";

import type { EmailVerificationDto } from "@cocrepo/api/idp/email-verifications";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildEmailVerificationTableColumns,
	ConfirmModal,
	DataGrid,
	DataGridStateModel,
	PageTitleBar,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { useOverlayState } from "@heroui/react";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useState } from "react";

const EMAIL_VERIFICATION_STATUS_OPTIONS = [
	{
		value: "PENDING",
		label: "대기",
	},
	{
		value: "VERIFIED",
		label: "인증 완료",
	},
	{
		value: "EXPIRED",
		label: "만료",
	},
];
const leftInputs: InputConfig[] = [
	{
		type: "search",
		id: "email",
		placeholder: "이메일로 검색...",
	},
	{
		type: "select",
		id: "status",
		placeholder: "상태",
		props: {
			options: EMAIL_VERIFICATION_STATUS_OPTIONS,
			isClearable: true,
		},
	},
];
export const adminEmailVerificationsPageQueryInputs = [...leftInputs];
export interface EmailVerificationListScreenQueryStates
	extends DataGridQueryStates {
	take: number;
	skip: number;
	email: string;
	status: string;
}
export type EmailVerificationListScreenSetQueryStates = DataGridSetQueryStates;
export interface EmailVerificationListScreenProps {
	verifications?: EmailVerificationDto[];
	totalCount: number;
	isLoading: boolean;
	isResending: boolean;
	queryStates: EmailVerificationListScreenQueryStates;
	setQueryStates: EmailVerificationListScreenSetQueryStates;
	onConfirmResendEmailVerification: (emailVerificationId: string) => void;
}

/**
 * 회원가입 이메일 인증 관리 목록 pure screen입니다.
 */
export const EmailVerificationListScreen = observer(
	({
		verifications,
		totalCount,
		isLoading,
		isResending,
		queryStates,
		setQueryStates,
		onConfirmResendEmailVerification,
	}: EmailVerificationListScreenProps) => {
		const gridState = useLocalObservable(
			() =>
				new DataGridStateModel({
					queryStates,
					setQueryStates,
				}),
		);
		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const resendModal = useOverlayState();
		const [verificationToResend, setVerificationToResend] =
			useState<EmailVerificationDto | null>(null);
		const rows = verifications ?? [];
		const onClickOpenResendModal = (
			verification: EmailVerificationDto,
		): void => {
			setVerificationToResend(verification);
			resendModal.open();
		};
		const onCloseResendModal = (): void => {
			setVerificationToResend(null);
			resendModal.close();
		};
		const onClickConfirmResend = (): void => {
			if (!verificationToResend) {
				return;
			}
			onConfirmResendEmailVerification(verificationToResend.id);
			onCloseResendModal();
		};
		const columns = buildEmailVerificationTableColumns<EmailVerificationDto>({
			onClickOpenResendModal,
		});
		return (
			<VStack>
				<PageTitleBar
					title="이메일 인증"
					description="회원가입 전 이메일 인증 요청과 발송 상태를 관리합니다."
				/>
				<SectionSurface className="rounded-2xl border-border/80 bg-surface/70">
					<Section overflow="hidden">
						<Section.Body>
							<DataGrid
								config={{
									entity: "EmailVerification",
									columns,
									leftInputs,
									emptyMessage: "조회된 이메일 인증 요청이 없습니다.",
								}}
								rows={rows}
								totalCount={totalCount}
								state={gridState}
								isLoading={isLoading}
							/>
						</Section.Body>
					</Section>
				</SectionSurface>
				<ConfirmModal
					isOpen={resendModal.isOpen}
					onClose={onCloseResendModal}
					onConfirm={onClickConfirmResend}
					title="인증 메일 재발송"
					message={
						<>
							<p>
								<strong>{verificationToResend?.email}</strong> 주소로 인증
								메일을 다시 발송하시겠습니까?
							</p>
							<p className="mt-2 text-sm text-muted">
								재발송하면 기존 인증 링크는 새 링크로 교체됩니다.
							</p>
						</>
					}
					confirmText="재발송"
					confirmColor="primary"
					iconType="info"
					loading={isResending}
				/>
			</VStack>
		);
	},
);
