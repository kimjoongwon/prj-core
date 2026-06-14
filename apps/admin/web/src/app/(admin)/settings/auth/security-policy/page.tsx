"use client";

import {
	getGetSecurityPolicyQueryKey,
	type UpdateSecurityPolicyMutationBody,
	useGetSecurityPolicy,
	useUpdateSecurityPolicy,
} from "@cocrepo/api/idp/security-policy";
import {
	SecurityPolicyFormScreen,
	type SecurityPolicyFormScreenFormState,
} from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { observer, useLocalObservable } from "mobx-react-lite";
import { useEffect, useState } from "react";

export default observer(function SecurityPolicyPageRoute() {
	const queryClient = useQueryClient();
	const [isSaveSuccess, setIsSaveSuccess] = useState(false);
	const state = useLocalObservable<SecurityPolicyFormScreenFormState>(() => ({
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
	}));
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
		if (!response?.data) {
			return;
		}
		state.passwordMinLength = response.data.passwordMinLength;
		state.passwordRequireUppercase = response.data.passwordRequireUppercase;
		state.passwordRequireLowercase = response.data.passwordRequireLowercase;
		state.passwordRequireNumber = response.data.passwordRequireNumber;
		state.passwordRequireSpecial = response.data.passwordRequireSpecial;
		state.passwordExpirationDays = response.data.passwordExpirationDays;
		state.passwordReuseLimit = response.data.passwordReuseLimit;
		state.temporaryLockThreshold = response.data.temporaryLockThreshold;
		state.temporaryLockDurationMin = response.data.temporaryLockDurationMin;
		state.permanentLockThreshold = response.data.permanentLockThreshold;
		state.accessTokenTtlSec = response.data.accessTokenTtlSec;
		state.refreshTokenTtlSec = response.data.refreshTokenTtlSec;
		state.sessionTtlSec = response.data.sessionTtlSec;
	}, [response?.data, state]);

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
		<>
			<SecurityPolicyFormScreen
				formState={state}
				isSaving={isPending}
				isSaveSuccess={isSaveSuccess}
				onChangeNumberField={(field, value) => {
					const num = Number(value);
					if (!Number.isNaN(num)) {
						state[field] = num;
					}
				}}
				onChangeBooleanField={(field, value) => {
					state[field] = value;
				}}
				onSubmit={() => {
					updatePolicy({
						data: mapUpdateSecurityPolicyInput(state),
					});
				}}
			/>
		</>
	);
});

function mapUpdateSecurityPolicyInput(
	input: SecurityPolicyFormScreenFormState,
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
