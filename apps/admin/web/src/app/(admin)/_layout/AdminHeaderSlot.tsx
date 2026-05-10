"use client";

import { useLogout, useSetCurrentSpace } from "@cocrepo/api/idp/auth";
import type { SpaceInfo } from "@cocrepo/ui";
import {
	HeaderBar,
	HeaderSpaceSelector,
	LanguageSelectButton,
	ThemeToggleButton,
	useT,
} from "@cocrepo/ui";
import { Button, Tooltip } from "@cocrepo/ui/heroui";
import { KeyRound } from "lucide-react";
import { observer } from "mobx-react-lite";
import { resolveIdpClientUrl } from "@/runtime-urls";
import {
	useAppStore,
	useNavigationStore,
	usePersistStore,
} from "@/stores/AppStoreProvider";

const userInfo = {
	name: "관리자",
	role: "Owner",
};

export const AdminHeaderSlot = observer(function AdminHeaderSlot() {
	const t = useT();
	const appStore = useAppStore();
	const persistStore = usePersistStore();
	const navigationStore = useNavigationStore();
	const localeStore = appStore.localeStore;
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
					const nextContentLanguageCode =
						persistStore.spaces.find(
							(space) => space.spaceId === variables.spaceId,
						)?.contentLanguageCode ?? null;
					persistStore.setSpace(
						variables.spaceId,
						nextGroundName,
						nextContentLanguageCode,
					);
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
		selectedSubNavItem && selectedNavItem ? selectedNavItem.label : "현재 섹션";

	return (
		<HeaderBar
			userInfo={userInfo}
			onLogout={onClickLogoutButton}
			context={
				<div className="min-w-0">
					<p className="text-[11px] font-medium uppercase tracking-[0.22em] text-default-500">
						{t(currentSectionCaption)}
					</p>
					<p className="truncate text-sm font-semibold text-foreground">
						{t(currentSectionLabel)}
					</p>
				</div>
			}
			actions={
				<>
					{localeStore && (
						<LanguageSelectButton
							value={localeStore.languageCode}
							onChange={(languageCode) => {
								localeStore.setLanguageCode(languageCode);
							}}
							compact
							className="h-10 w-10 rounded-2xl border border-divider bg-content1/80 text-foreground shadow-sm backdrop-blur-md hover:bg-content2"
						/>
					)}
					<ThemeToggleButton
						compact
						className="h-10 w-10 rounded-2xl border border-divider bg-content1/80 text-foreground shadow-sm backdrop-blur-md hover:bg-content2"
					/>
					<Tooltip content={t("IDP 관리")} placement="bottom">
						<Button
							variant="light"
							isIconOnly
							className="h-11 w-11 rounded-2xl border border-divider bg-content1/80 shadow-sm backdrop-blur-md hover:bg-content2"
							aria-label={t("IDP 관리 콘솔 열기")}
							onPress={onClickOpenIdpClientButton}
						>
							<KeyRound className="h-5 w-5 text-default-600" size={20} />
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
