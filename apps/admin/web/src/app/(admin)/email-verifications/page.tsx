"use client";

import {
	type EmailVerificationStatusType,
	getGetEmailVerificationsQueryKey,
	useGetEmailVerifications,
	useResendEmailVerification,
} from "@cocrepo/api/core/email-verifications";
import { EmailVerificationListScreen } from "@cocrepo/ui";
import { toast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";

export default observer(function EmailVerificationsPageRoute() {
	const queryClient = useQueryClient();
	const [queryStates, setQueryStates] = useQueryStates({
		take: parseAsInteger.withDefault(20),
		skip: parseAsInteger.withDefault(0),
		email: parseAsString.withDefault(""),
		status: parseAsString.withDefault(""),
	});
	const queryParams = {
		take: queryStates.take,
		skip: queryStates.skip,
		email: queryStates.email || undefined,
		status: queryStates.status
			? (queryStates.status as EmailVerificationStatusType)
			: undefined,
	};
	const {
		data: response,
		isLoading,
		isFetching,
	} = useGetEmailVerifications(queryParams);
	const { mutateAsync: resendEmailVerification } = useResendEmailVerification({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: getGetEmailVerificationsQueryKey(),
				});
				toast.success("인증 메일 재발송", {
					description: "인증 메일을 다시 발송했습니다.",
				});
			},
			onError: (error) => {
				toast.danger("인증 메일 재발송 실패", {
					description:
						error.message || "인증 메일 재발송 중 오류가 발생했습니다.",
				});
			},
		},
	});

	return (
		<EmailVerificationListScreen
			verifications={response?.data}
			totalCount={response?.meta?.totalCount ?? 0}
			isLoading={isLoading || isFetching}
			queryStates={queryStates}
			setQueryStates={setQueryStates}
			onClickResendEmailVerificationButton={(emailVerificationId) => {
				void resendEmailVerification({
					emailVerificationId: String(emailVerificationId),
				});
			}}
		/>
	);
});
