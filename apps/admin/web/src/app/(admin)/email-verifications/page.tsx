"use client";

import {
	type EmailVerificationStatusType,
	getGetEmailVerificationsQueryKey,
	useGetEmailVerifications,
	useResendEmailVerification,
} from "@cocrepo/api/idp/email-verifications";
import { EmailVerificationListScreen } from "@cocrepo/ui";
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
	const { mutate: resendEmailVerification, isPending: isResending } =
		useResendEmailVerification({
			mutation: {
				onSuccess: () => {
					queryClient.invalidateQueries({
						queryKey: getGetEmailVerificationsQueryKey(),
					});
				},
			},
		});

	return (
		<>
			<EmailVerificationListScreen
				verifications={response?.data}
				totalCount={response?.meta?.totalCount ?? 0}
				isLoading={isLoading || isFetching}
				isResending={isResending}
				queryStates={queryStates}
				setQueryStates={setQueryStates}
				onConfirmResendEmailVerification={(emailVerificationId) => {
					resendEmailVerification({ emailVerificationId });
				}}
			/>
		</>
	);
});
