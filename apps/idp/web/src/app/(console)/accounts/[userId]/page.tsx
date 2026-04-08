"use client";

import {
	useForceResetPassword,
	useInvalidateUserSessions,
	useUnlockAccount,
} from "@cocrepo/api/idp/auth";
import {
	getGetIdpAccountQueryKey,
	type IdpAccountDto,
	useGetIdpAccount,
	useResetIdpAccountFailedAttempts,
	useToggleIdpAccountActive,
} from "@cocrepo/api/idp/idp-accounts";
import {
	IdpConsoleAccountsUserIdPage,
	type IdpConsoleAccountsUserIdPageAccount,
	type IdpConsoleAccountsUserIdPageModalAction,
} from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default observer(function AccountDetailPageRoute() {
	const userId = useParams<{ userId: string }>().userId;
	const router = useRouter();
	const queryClient = useQueryClient();
	const [modalAction, setModalAction] =
		useState<IdpConsoleAccountsUserIdPageModalAction>(null);
	const { data: response, isLoading } = useGetIdpAccount(userId);
	const account = response?.data;

	const invalidateAccountDetail = () => {
		queryClient.invalidateQueries({
			queryKey: getGetIdpAccountQueryKey(userId),
		});
	};

	const { mutate: toggleActive, isPending: isToggling } =
		useToggleIdpAccountActive({
			mutation: {
				onSuccess: invalidateAccountDetail,
			},
		});
	const { mutate: resetFailedAttempts, isPending: isResetting } =
		useResetIdpAccountFailedAttempts({
			mutation: {
				onSuccess: invalidateAccountDetail,
			},
		});
	const { mutate: unlockAccount, isPending: isUnlocking } = useUnlockAccount({
		mutation: {
			onSuccess: invalidateAccountDetail,
		},
	});
	const { mutate: forceResetPassword, isPending: isForceResetting } =
		useForceResetPassword({
			mutation: {
				onSuccess: invalidateAccountDetail,
			},
		});
	const { mutate: invalidateSessions, isPending: isInvalidating } =
		useInvalidateUserSessions({
			mutation: {
				onSuccess: invalidateAccountDetail,
			},
		});

	return (
		<IdpConsoleAccountsUserIdPage
			account={account ? mapAccountDetail(account) : undefined}
			isLoading={isLoading}
			isToggling={isToggling}
			isResetting={isResetting}
			isUnlocking={isUnlocking}
			isForceResetting={isForceResetting}
			isInvalidating={isInvalidating}
			modalAction={modalAction}
			onClickBackButton={() => {
				router.push("/accounts" as Route);
			}}
			onClickToggleActiveButton={() => {
				toggleActive({ userId });
			}}
			onClickResetFailedAttemptsButton={() => {
				resetFailedAttempts({ userId });
			}}
			onClickOpenUnlockModal={() => {
				setModalAction("unlock");
			}}
			onClickOpenForceResetPasswordModal={() => {
				setModalAction("forceResetPassword");
			}}
			onClickOpenInvalidateSessionsModal={() => {
				setModalAction("invalidateSessions");
			}}
			onCloseModal={() => {
				setModalAction(null);
			}}
			onClickConfirmModal={() => {
				switch (modalAction) {
					case "unlock":
						unlockAccount({ userId });
						break;
					case "forceResetPassword":
						forceResetPassword({ userId });
						break;
					case "invalidateSessions":
						invalidateSessions({ userId });
						break;
				}
				setModalAction(null);
			}}
		/>
	);
});

function mapAccountDetail(
	account: IdpAccountDto,
): IdpConsoleAccountsUserIdPageAccount {
	return {
		id: account.id,
		name: account.name,
		email: account.email,
		isActive: account.isActive,
		isPermanentlyLocked: account.isPermanentlyLocked,
		lockedUntil: account.lockedUntil ?? null,
		failedLoginAttempts: account.failedLoginAttempts,
		mustChangePassword: account.mustChangePassword,
		lastLoginAt: account.lastLoginAt ?? null,
		lastLoginIp: account.lastLoginIp,
		createdAt: account.createdAt ?? null,
	};
}
