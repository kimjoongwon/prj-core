"use client";

import { useNativeLogout, useSetCurrentSpace } from "@cocrepo/api/idp/auth";
import type { SpaceInfo } from "@cocrepo/ui";
import {
	HeaderBar,
	HeaderSpaceSelector,
	LanguageSelectButton,
	ThemeToggleButton,
	useT,
} from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
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
	const { mutate: nativeLogoutMutate } = useNativeLogout({
		mutation: {
			onSettled: () => {
				persistStore.clear();
				window.location.href = "/admin/auth/login";
			},
		},
	});

	const onClickLogoutButton = () => {
		if (!persistStore.sessionId) {
			persistStore.clear();
			window.location.href = "/admin/auth/login";
			return;
		}

		nativeLogoutMutate({
			data: {
				sessionId: persistStore.sessionId,
				refreshToken: persistStore.refreshToken ?? undefined,
			},
		});
	};

	const onSelectSpace = (space: SpaceInfo) => {
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
			userInfo={userInfo}
			onLogout={onClickLogoutButton}
			context={
				<div className="min-w-0">
					<p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted">
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
							className="h-10 w-10 rounded-2xl border border-border bg-surface/80 text-foreground shadow-sm backdrop-blur-md hover:bg-surface-secondary"
						/>
					)}
					<ThemeToggleButton
						compact
						className="h-10 w-10 rounded-2xl border border-border bg-surface/80 text-foreground shadow-sm backdrop-blur-md hover:bg-surface-secondary"
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
