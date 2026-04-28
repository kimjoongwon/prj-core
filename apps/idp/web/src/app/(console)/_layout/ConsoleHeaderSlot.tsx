"use client";

import {
	useLogout,
	useSetCurrentSpace,
	useVerifyToken,
} from "@cocrepo/api/idp/auth";
import {
	useConsoleNavigationStore,
	useConsolePersistStore,
} from "@cocrepo/store";
import { HeaderBar, HeaderSpaceSelector, ThemeToggleButton } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { IdpConsoleBrand } from "@/components/console/IdpConsoleBrand";
import {
	getIdpConsoleIconName,
	IdpConsoleIcon,
} from "@/components/console/IdpConsoleIcon";

const userInfo = {
	name: "IDP 관리자",
	role: "SPACE_SCOPED",
};

export const ConsoleHeaderSlot = observer(function ConsoleHeaderSlot() {
	const navigationStore = useConsoleNavigationStore();
	const persistStore = useConsolePersistStore();
	const shouldVerifyCurrentTenant =
		persistStore.isHydrated && persistStore.isSpaceSelectionResolved;
	const { data: verifyTokenResponse } = useVerifyToken({
		query: {
			enabled: shouldVerifyCurrentTenant,
			retry: false,
			refetchOnWindowFocus: false,
		},
	});
	const hasFullAccessInCurrentTenant =
		verifyTokenResponse?.data?.hasFullAccess === true;
	const { mutate: setCurrentSpaceMutate, isPending: isSettingCurrentSpace } =
		useSetCurrentSpace({
			mutation: {
				onSuccess: (response, variables) => {
					const currentSpace = response.data;
					const nextGroundName =
						currentSpace?.ground?.name ??
						persistStore.spaces.find(
							(space) => space.spaceId === variables.spaceId,
						)?.groundName ??
						"";
					persistStore.setSpace(variables.spaceId, nextGroundName);
					window.location.reload();
				},
			},
		});
	const { mutate: logoutMutate } = useLogout({
		mutation: {
			onSettled: () => {
				persistStore.clearSpace();
				window.location.href = "/auth/login";
			},
		},
	});

	const onClickLogoutButton = () => {
		logoutMutate();
	};

	const onSelectSpace = (space: { spaceId: string }) => {
		if (isSettingCurrentSpace) {
			return;
		}

		setCurrentSpaceMutate({ spaceId: space.spaceId });
	};

	const selectedNavItem = navigationStore.selectedNavItem;
	const selectedSubNavItem = navigationStore.selectedSubNavItem;
	const currentSectionLabel =
		selectedSubNavItem?.label ?? selectedNavItem?.label ?? "대시보드";
	const currentSectionCaption =
		selectedSubNavItem && selectedNavItem ? selectedNavItem.label : "현재 섹션";

	return (
		<HeaderBar
			userInfo={{
				...userInfo,
				role: hasFullAccessInCurrentTenant ? "FULL_ACCESS" : "SPACE_SCOPED",
			}}
			onLogout={onClickLogoutButton}
			leading={<IdpConsoleBrand />}
			context={
				<>
					<span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-slate-200/80 bg-white/84 text-slate-700 shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
						<IdpConsoleIcon
							name={getIdpConsoleIconName(selectedNavItem?.id)}
							size={20}
						/>
					</span>
					<div className="min-w-0">
						<p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
							{currentSectionCaption}
						</p>
						<p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
							{currentSectionLabel}
						</p>
					</div>
				</>
			}
			actions={
				<>
					<ThemeToggleButton
						compact
						className="h-10 w-10 rounded-2xl border border-slate-200/70 bg-white/72 text-slate-700 shadow-sm backdrop-blur-md hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
					/>
					<HeaderSpaceSelector
						spaces={persistStore.spaces}
						currentSpaceId={persistStore.spaceId}
						currentSpaceName={persistStore.groundName}
						onSpaceSelect={onSelectSpace}
					/>
				</>
			}
		/>
	);
});
