"use client";

import type { EmailVerificationDto } from "@cocrepo/api/idp/email-verifications";
import type {
	DataGridQueryState,
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
import { DataGridLoading } from "../../data-grid/DataGridLoading";

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
					query: queryStates,
					setQueryStates,
					toolbar: { leftInputs },
					table: {
						entity: "EmailVerification",
						columns: buildEmailVerificationTableColumns<EmailVerificationDto>({
							onClickResendEmailVerification: (verification) =>
								onClickResendEmailVerificationButton(verification.id),
						}),
					},
					rows: verifications ?? [],
					totalCount,
				}),
		);
		useEffect(() => {
			gridState.query.update(queryStates);
			gridState.rows = verifications ?? [];
			gridState.pagination.setTotalCount(totalCount);
		}, [gridState, queryStates, verifications, totalCount]);
		const onClickResendEmailVerification = (
			verification: EmailVerificationDto,
		): void => {
			onClickResendEmailVerificationButton(verification.id);
		};
		gridState.table.columns =
			buildEmailVerificationTableColumns<EmailVerificationDto>({
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
							{isLoading ? <DataGridLoading /> : <DataGrid state={gridState} />}
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
