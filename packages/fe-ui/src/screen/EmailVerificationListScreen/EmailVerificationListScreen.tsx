"use client";

import type { EmailVerificationDto } from "@cocrepo/api/core/email-verifications";
import type {
	DataGridQueryStates,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildEmailVerificationTableColumns,
	DataGrid,
	DataGridState,
	Screen,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect } from "react";

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
	queryStates: EmailVerificationListScreenQueryStates;
	setQueryStates: EmailVerificationListScreenSetQueryStates;
	onClickResendEmailVerificationButton: (emailVerificationId: bigint) => void;
}

/**
 * 회원가입 이메일 인증 관리 목록 pure screen입니다.
 */
export const EmailVerificationListScreen = observer(
	({
		verifications,
		totalCount,
		isLoading,
		queryStates,
		setQueryStates,
		onClickResendEmailVerificationButton,
	}: EmailVerificationListScreenProps) => {
		const gridState = useLocalObservable(
			() =>
				new DataGridState({
					queryStates,
					setQueryStates,
				}),
		);
		useEffect(() => {
			gridState.syncQuery(queryStates, setQueryStates);
		}, [gridState, queryStates, setQueryStates]);
		const rows = verifications ?? [];
		const onClickResendEmailVerification = (
			verification: EmailVerificationDto,
		): void => {
			onClickResendEmailVerificationButton(verification.id);
		};
		const columns = buildEmailVerificationTableColumns<EmailVerificationDto>({
			onClickResendEmailVerification,
		});
		return (
			<VStack>
				<Screen.Header
					title="이메일 인증"
					description="회원가입 전 이메일 인증 요청과 발송 상태를 관리합니다."
				/>
				<SectionSurface className="rounded-2xl border-border/80 bg-surface">
					<Section overflow="hidden">
						<Section.Body>
							<DataGrid
								config={{
									toolbar: {
										leftInputs,
									},
									table: {
										entity: "EmailVerification",
										columns,
										emptyMessage: "조회된 이메일 인증 요청이 없습니다.",
									},
								}}
								rows={rows}
								totalCount={totalCount}
								state={gridState}
								isLoading={isLoading}
							/>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
