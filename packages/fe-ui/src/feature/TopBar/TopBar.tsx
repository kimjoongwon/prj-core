"use client";

import { useNativeLogout, useSetCurrentSpace } from "@cocrepo/api/idp/auth";
import {
	type SpaceInfo,
	useNavigationStore,
	usePersistStore,
	useStore,
} from "@cocrepo/store";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { HeaderBar } from "../../widget/HeaderBar";
import { HeaderSpaceSelector } from "../HeaderSpaceSelector";
import { LanguageSelectButton } from "../LanguageSelectButton";
import { ThemeToggleButton } from "../ThemeToggleButton";
import { useT } from "../../i18n";

const userInfo = {
	name: "관리자",
	role: "Owner",
};

const utilityButtonClassName =
	"h-10 w-10 rounded-2xl border border-border bg-surface/80 text-foreground shadow-sm backdrop-blur-md hover:bg-surface-secondary";

/**
 * 현재 섹션 context, locale/theme action, Space 선택, logout을 렌더링합니다.
 */
export const TopBar = observer(function TopBar() {
	const router = useRouter();
	const t = useT();
	const store = useStore();
	const persistStore = usePersistStore();
	const navigationStore = useNavigationStore();
	const localeStore = store.localeStore;
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
				router.replace("/auth/login");
			},
		},
	});

	const onClickLogoutButton = () => {
		if (!persistStore.sessionId) {
			persistStore.clear();
			router.replace("/auth/login");
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

	const onChangeLanguage = (languageCode: Parameters<
		NonNullable<typeof localeStore>["setLanguageCode"]
	>[0]) => {
		localeStore?.setLanguageCode(languageCode);
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
							onChange={onChangeLanguage}
							compact
							className={utilityButtonClassName}
						/>
					)}
					<ThemeToggleButton compact className={utilityButtonClassName} />
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
