"use client";

import type { EmailVerificationDto } from "@cocrepo/api/idp/email-verifications";
import type {
	DataGridQueryState,
	DataGridSetQueryStates,
	InputConfig,
} from "@cocrepo/type";
import {
	buildEmailVerificationTableColumns,
	createDataGridState,
	DataGrid,
	Screen,
	Section,
	SectionSurface,
	VStack,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";

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
	extends DataGridQueryState {
	take: number;
	skip: number;
	email: string;
	status: string;
}
export type EmailVerificationListScreenSetQueryStates = DataGridSetQueryStates;
export interface EmailVerificationListScreenProps {
	verifications: EmailVerificationDto[];
	totalCount: number;
	queryStates: EmailVerificationListScreenQueryStates;
	setQueryStates: EmailVerificationListScreenSetQueryStates;
	onClickResendEmailVerificationButton: (emailVerificationId: string) => void;
}

/**
 * 회원가입 이메일 인증 관리 목록 pure screen입니다.
 */
export const EmailVerificationListScreen = observer(
	({
		verifications,
		totalCount,
		queryStates,
		setQueryStates,
		onClickResendEmailVerificationButton,
	}: EmailVerificationListScreenProps) => {
		const gridState = useMemo(
			() =>
				createDataGridState<EmailVerificationDto>({
					query: queryStates,
					setQueryStates,
					pagination: { totalCount },
					toolbar: { leftInputs },
					table: {
						rows: verifications,
						columns: buildEmailVerificationTableColumns<EmailVerificationDto>({
							onClickResendEmailVerification: (verification) =>
								onClickResendEmailVerificationButton(verification.id),
						}),
					},
				}),
			[
				verifications,
				totalCount,
				queryStates,
				setQueryStates,
				onClickResendEmailVerificationButton,
			],
		);
		return (
			<VStack>
				<Screen.Header
					title="이메일 인증"
					description="회원가입 전 이메일 인증 요청과 발송 상태를 관리합니다."
				/>
				<SectionSurface className="rounded-2xl border-border/80 bg-surface">
					<Section overflow="hidden">
						<Section.Body>
							<DataGrid state={gridState} />
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
