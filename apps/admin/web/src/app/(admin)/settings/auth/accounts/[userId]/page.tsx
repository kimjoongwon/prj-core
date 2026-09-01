"use client";

import {
	useForceResetPassword,
	useInvalidateUserSessions,
	useUnlockAccount,
} from "@cocrepo/api/core/auth";
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
} from "@cocrepo/api/core/idp-accounts";
import {
	AccountDetailScreen,
	type AccountDetailScreenAccessGrantForm,
	type AccountDetailScreenAccount,
	type AccountDetailScreenOption,
} from "@cocrepo/ui";
import { useQueryClient } from "@tanstack/react-query";
import { observer, useLocalObservable } from "mobx-react-lite";
import type { Route } from "next";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

class AccountDetailScreenRouteState {
	accessGrantForm: AccountDetailScreenAccessGrantForm = {
		spaceId: "",
		roleId: "",
	};

	resetAccessGrantForm(bootstrap: IdpAccountAccessGrantFormBootstrapDto) {
		this.accessGrantForm = {
			spaceId: getDefaultString(bootstrap, "spaceId"),
			roleId: getDefaultString(bootstrap, "roleId"),
		};
	}

	selectAccessGrantSpace(spaceId: string) {
		this.accessGrantForm.spaceId = spaceId;
	}

	selectAccessGrantRole(roleId: string) {
		this.accessGrantForm.roleId = roleId;
	}
}

export default observer(function AccountDetailScreenRoute() {
	const userId = useParams<{ userId: string }>().userId;
	const router = useRouter();
	const queryClient = useQueryClient();
	const state = useLocalObservable(() => new AccountDetailScreenRouteState());
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

		state.resetAccessGrantForm(accessGrantBootstrap);
	}, [accessGrantBootstrap, state]);

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
		<AccountDetailScreen
			account={account ? mapAccountDetail(account) : undefined}
			isLoading={isLoading}
			accessGrantForm={state.accessGrantForm}
			spaceOptions={spaceOptions}
			roleOptions={roleOptions}
			isAccessGrantFormLoading={isAccessGrantFormLoading}
			isGrantingAccess={isGrantingAccess}
			isToggling={isToggling}
			isResetting={isResetting}
			isUnlocking={isUnlocking}
			isForceResetting={isForceResetting}
			isInvalidating={isInvalidating}
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
				state.selectAccessGrantSpace(spaceId);
			}}
			onChangeAccessGrantRole={(roleId) => {
				state.selectAccessGrantRole(roleId);
			}}
			onClickGrantAccessButton={() => {
				grantAccess({
					userId,
					data: {
						spaceId: BigInt(state.accessGrantForm.spaceId),
						roleId: BigInt(state.accessGrantForm.roleId),
					},
				});
			}}
			onClickUnlockAccountButton={() => {
				unlockAccount({ userId });
			}}
			onClickForceResetPasswordButton={() => {
				forceResetPassword({ userId });
			}}
			onClickInvalidateSessionsButton={() => {
				invalidateSessions({ userId });
			}}
		/>
	);
});

function mapAccountDetail(
	account: IdpAccountDetailDto,
): AccountDetailScreenAccount {
	return {
		id: String(account.id),
		name: account.name,
		email: account.email,
		isActive: account.isActive,
		isPermanentlyLocked: account.isPermanentlyLocked,
		lockedUntil: formatLocalDateTime(account.lockedUntil),
		failedLoginAttempts: account.failedLoginAttempts,
		mustChangePassword: account.mustChangePassword,
		lastLoginAt: formatLocalDateTime(account.lastLoginAt),
		lastLoginIp: account.lastLoginIp,
		createdAt: formatLocalDateTime(account.createdAt) ?? "",
		accessGrants: (account.accessGrants ?? []).map((grant) => ({
			tenantId: String(grant.tenantId),
			spaceId: String(grant.spaceId),
			spaceName: grant.spaceName,
			spaceLabel: grant.spaceLabel ?? null,
			roleId: String(grant.roleId),
			roleName: grant.roleName,
			roleDisplayName: grant.roleDisplayName ?? null,
			grantedAt: formatLocalDateTime(grant.grantedAt) ?? "",
			updatedAt: formatLocalDateTime(grant.updatedAt),
		})),
	};
}

function mapOptions(
	bootstrap: IdpAccountAccessGrantFormBootstrapDto | undefined,
	path: "spaceId" | "roleId",
): AccountDetailScreenOption[] {
	return (bootstrap?.options[path] ?? []).map(
		(option: IdpAccountAccessGrantFormOptionItemDto) => ({
			value: String(option.value),
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
	return typeof value === "string" || typeof value === "bigint"
		? String(value)
		: "";
}

function formatLocalDateTime(value?: Date | null): string | null {
	return value ? value.toLocaleString("ko-KR") : null;
}
