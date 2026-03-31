"use client";

import { useLogout, useSetCurrentSpace } from "@cocrepo/api/idp/auth";
import type { SpaceInfo } from "@cocrepo/ui";
import {
	AppLogo,
	HeaderBar,
	HeaderSpaceSelector,
	ThemeToggleButton,
} from "@cocrepo/ui";
import { Button, Tooltip } from "@heroui/react";
import { KeyRound } from "lucide-react";
import { observer } from "mobx-react-lite";
import { resolveIdpClientUrl } from "@/runtime-urls";
import {
	useNavigationStore,
	usePersistStore,
} from "@/stores/AppStoreProvider";

const userInfo = {
	name: "관리자",
	role: "Owner",
};

export const AdminHeaderSlot = observer(function AdminHeaderSlot() {
	const persistStore = usePersistStore();
	const navigationStore = useNavigationStore();
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
				window.location.href = "/admin/auth/login";
			},
		},
	});

	const onClickLogoutButton = () => {
		logoutMutate();
	};

	const onSelectSpace = (space: SpaceInfo) => {
		if (isSettingCurrentSpace) {
			return;
		}

		setCurrentSpaceMutate({ spaceId: space.spaceId });
	};

	const onClickOpenIdpClientButton = () => {
		const idpClientUrl = resolveIdpClientUrl();
		if (idpClientUrl) {
			window.open(idpClientUrl, "_blank");
		}
	};

	const selectedNavItem = navigationStore.selectedNavItem;
	const selectedSubNavItem = navigationStore.selectedSubNavItem;
	const currentSectionLabel =
		selectedSubNavItem?.label ?? selectedNavItem?.label ?? "대시보드";
	const currentSectionCaption =
		selectedSubNavItem && selectedNavItem
			? selectedNavItem.label
			: "현재 섹션";

	return (
		<HeaderBar
			userInfo={userInfo}
			onLogout={onClickLogoutButton}
			leading={
				<AppLogo
					icon="LayoutGrid"
					text="플레이트"
					subtitle="Operations Console"
					variant="console"
				/>
			}
			context={
				<div className="min-w-0">
					<p className="text-[11px] font-medium uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
						{currentSectionCaption}
					</p>
					<p className="truncate text-sm font-semibold text-slate-950 dark:text-slate-50">
						{currentSectionLabel}
					</p>
				</div>
			}
			actions={
				<>
					<ThemeToggleButton
						compact
						className="h-10 w-10 rounded-2xl border border-slate-200/70 bg-white/72 text-slate-700 shadow-sm backdrop-blur-md hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100 dark:hover:bg-white/10"
					/>
					<Tooltip content="IDP 관리" placement="bottom">
						<Button
							variant="light"
							isIconOnly
							className="h-11 w-11 rounded-2xl border border-slate-200/70 bg-white/72 shadow-sm backdrop-blur-md hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10"
							aria-label="IDP 관리 콘솔 열기"
							onPress={onClickOpenIdpClientButton}
						>
							<KeyRound
								className="h-5 w-5 text-slate-600 dark:text-slate-200"
								size={20}
							/>
						</Button>
					</Tooltip>
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
