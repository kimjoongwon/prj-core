"use client";

import {
	useForceResetPassword,
	useInvalidateUserSessions,
	useUnlockAccount,
} from "@cocrepo/api/idp/auth";
import {
	getGetIdpAccountAccessGrantFormQueryKey,
	getGetIdpAccountQueryKey,
	type IdpAccountAccessGrantFormBootstrapDto,
	type IdpAccountAccessGrantFormOptionItemDto,
	type IdpAccountDetailDto,
	useGetIdpAccount,
	useGetIdpAccountAccessGrantForm,
	useGrantIdpAccountAccess,
	useResetIdpAccountFailedAttempts,
	useToggleIdpAccountActive,
} from "@cocrepo/api/idp/idp-accounts";
import {
	AccountDetailScreen,
	type AccountDetailScreenAccessGrantForm,
	type AccountDetailScreenAccount,
	type AccountDetailScreenModalAction,
	type AccountDetailScreenOption,
} from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { observer } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default observer(function AccountDetailScreenRoute() {
	const userId = useParams<{ userId: string }>().userId;
	const router = useRouter();
	const queryClient = useQueryClient();
	const [modalAction, setModalAction] =
		useState<AccountDetailScreenModalAction>(null);
	const [accessGrantForm, setAccessGrantForm] =
		useState<AccountDetailScreenAccessGrantForm>({
			spaceId: "",
			roleId: "",
		});
	const { data: response, isLoading } = useGetIdpAccount(userId);
	const account = response?.data;
	const { data: accessGrantFormResponse, isLoading: isAccessGrantFormLoading } =
		useGetIdpAccountAccessGrantForm(userId);
	const accessGrantBootstrap = accessGrantFormResponse?.data;
	const spaceOptions = mapOptions(accessGrantBootstrap, "spaceId");
	const roleOptions = mapOptions(accessGrantBootstrap, "roleId");

	useEffect(() => {
		if (!accessGrantBootstrap) {
			return;
		}

		setAccessGrantForm({
			spaceId: getDefaultString(accessGrantBootstrap, "spaceId"),
			roleId: getDefaultString(accessGrantBootstrap, "roleId"),
		});
	}, [accessGrantBootstrap]);

	const invalidateAccountDetail = () => {
		queryClient.invalidateQueries({
			queryKey: getGetIdpAccountQueryKey(userId),
		});
		queryClient.invalidateQueries({
			queryKey: getGetIdpAccountAccessGrantFormQueryKey(userId),
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
	const { mutate: grantAccess, isPending: isGrantingAccess } =
		useGrantIdpAccountAccess({
			mutation: {
				onSuccess: invalidateAccountDetail,
			},
		});

	return (
		<>
			<AccountDetailScreen
				account={account ? mapAccountDetail(account) : undefined}
				isLoading={isLoading}
				accessGrantForm={accessGrantForm}
				spaceOptions={spaceOptions}
				roleOptions={roleOptions}
				isAccessGrantFormLoading={isAccessGrantFormLoading}
				isGrantingAccess={isGrantingAccess}
				isToggling={isToggling}
				isResetting={isResetting}
				isUnlocking={isUnlocking}
				isForceResetting={isForceResetting}
				isInvalidating={isInvalidating}
				modalAction={modalAction}
				onClickBackButton={() => {
					router.push("/settings/auth/accounts" as Route);
				}}
				onClickToggleActiveButton={() => {
					toggleActive({ userId });
				}}
				onClickResetFailedAttemptsButton={() => {
					resetFailedAttempts({ userId });
				}}
				onChangeAccessGrantSpace={(spaceId) => {
					setAccessGrantForm((current) => ({ ...current, spaceId }));
				}}
				onChangeAccessGrantRole={(roleId) => {
					setAccessGrantForm((current) => ({ ...current, roleId }));
				}}
				onClickGrantAccessButton={() => {
					grantAccess({
						userId,
						data: accessGrantForm,
					});
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
		</>
	);
});

function mapAccountDetail(
	account: IdpAccountDetailDto,
): AccountDetailScreenAccount {
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
		accessGrants: (account.accessGrants ?? []).map((grant) => ({
			tenantId: grant.tenantId,
			spaceId: grant.spaceId,
			spaceName: grant.spaceName,
			spaceLabel: grant.spaceLabel ?? null,
			roleId: grant.roleId,
			roleName: grant.roleName,
			roleDisplayName: grant.roleDisplayName ?? null,
			grantedAt: grant.grantedAt,
			updatedAt: grant.updatedAt ?? null,
		})),
	};
}

function mapOptions(
	bootstrap: IdpAccountAccessGrantFormBootstrapDto | undefined,
	path: "spaceId" | "roleId",
): AccountDetailScreenOption[] {
	return (bootstrap?.options[path] ?? []).map(
		(option: IdpAccountAccessGrantFormOptionItemDto) => ({
			value: option.value,
			label: option.label,
			description: option.description,
		}),
	);
}

function getDefaultString(
	bootstrap: IdpAccountAccessGrantFormBootstrapDto,
	path: "spaceId" | "roleId",
): string {
	const value = bootstrap.defaultObject[path];
	return typeof value === "string" ? value : "";
}
