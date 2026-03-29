"use client";

import {
	getGetSecurityPolicyQueryKey,
	type UpdateSecurityPolicyMutationBody,
	useGetSecurityPolicy,
	useUpdateSecurityPolicy,
} from "@cocrepo/api/idp/security-policy";
import {
	IdpConsoleSecurityPolicyPage,
	type IdpConsoleSecurityPolicyPagePolicy,
	type IdpConsoleSecurityPolicyPageSubmitInput,
} from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";

export default observer(function SecurityPolicyPageRoute() {
	const queryClient = useQueryClient();
	const [isSaveSuccess, setIsSaveSuccess] = useState(false);
	const { data: response } = useGetSecurityPolicy();
	const { mutate: updatePolicy, isPending } = useUpdateSecurityPolicy({
		mutation: {
			onSuccess: () => {
				queryClient.invalidateQueries({
					queryKey: getGetSecurityPolicyQueryKey(),
				});
				setIsSaveSuccess(true);
			},
		},
	});

	useEffect(() => {
		if (!isSaveSuccess) {
			return;
		}

		const timer = window.setTimeout(() => {
			setIsSaveSuccess(false);
		}, 3000);

		return () => {
			window.clearTimeout(timer);
		};
	}, [isSaveSuccess]);

	return (
		<IdpConsoleSecurityPolicyPage
			policy={response?.data ? mapSecurityPolicy(response.data) : undefined}
			isSaving={isPending}
			isSaveSuccess={isSaveSuccess}
			onSubmit={(input) => {
				updatePolicy({
					data: mapUpdateSecurityPolicyInput(input),
				});
			}}
		/>
	);
});

function mapSecurityPolicy(policy: {
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
}): IdpConsoleSecurityPolicyPagePolicy {
	return {
		passwordMinLength: policy.passwordMinLength,
		passwordRequireUppercase: policy.passwordRequireUppercase,
		passwordRequireLowercase: policy.passwordRequireLowercase,
		passwordRequireNumber: policy.passwordRequireNumber,
		passwordRequireSpecial: policy.passwordRequireSpecial,
		passwordExpirationDays: policy.passwordExpirationDays,
		passwordReuseLimit: policy.passwordReuseLimit,
		temporaryLockThreshold: policy.temporaryLockThreshold,
		temporaryLockDurationMin: policy.temporaryLockDurationMin,
		permanentLockThreshold: policy.permanentLockThreshold,
		accessTokenTtlSec: policy.accessTokenTtlSec,
		refreshTokenTtlSec: policy.refreshTokenTtlSec,
		sessionTtlSec: policy.sessionTtlSec,
	};
}

function mapUpdateSecurityPolicyInput(
	input: IdpConsoleSecurityPolicyPageSubmitInput,
): UpdateSecurityPolicyMutationBody {
	return {
		passwordMinLength: input.passwordMinLength,
		passwordRequireUppercase: input.passwordRequireUppercase,
		passwordRequireLowercase: input.passwordRequireLowercase,
		passwordRequireNumber: input.passwordRequireNumber,
		passwordRequireSpecial: input.passwordRequireSpecial,
		passwordExpirationDays: input.passwordExpirationDays,
		passwordReuseLimit: input.passwordReuseLimit,
		temporaryLockThreshold: input.temporaryLockThreshold,
		temporaryLockDurationMin: input.temporaryLockDurationMin,
		permanentLockThreshold: input.permanentLockThreshold,
		accessTokenTtlSec: input.accessTokenTtlSec,
		refreshTokenTtlSec: input.refreshTokenTtlSec,
		sessionTtlSec: input.sessionTtlSec,
	};
}
