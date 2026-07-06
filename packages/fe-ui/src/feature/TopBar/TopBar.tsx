"use client";

import { useNativeLogout, useSetCurrentSpace } from "@cocrepo/api/idp/auth";
import { type SpaceInfo, useApp } from "@cocrepo/store";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useT } from "../../i18n";
import { Select } from "../../input/Select/Select";
import { LanguageSelectButton } from "../LanguageSelectButton";
import { ThemeToggleButton } from "../ThemeToggleButton";
import { HeaderBar } from "./HeaderBar";

const userInfo = {
	name: "관리자",
	role: "Owner",
};

const utilityButtonClassName =
	"h-10 w-10 rounded-lg border border-[#d7e4f2] bg-white text-foreground hover:bg-[#eef6ff] dark:border-white/10 dark:bg-neutral-900 dark:hover:bg-neutral-800";
const spaceSelectClassNames = {
	trigger:
		"inline-flex h-10 w-40 shrink-0 flex-nowrap items-center justify-start gap-2 rounded-lg border border-[#d7e4f2] bg-white px-3 text-foreground hover:bg-[#eef6ff] sm:w-52 lg:w-60 dark:border-white/10 dark:bg-neutral-900 dark:hover:bg-neutral-800",
	value: "min-w-0 flex-1 truncate text-left text-sm text-foreground",
	indicator: "h-4 w-4 shrink-0 text-muted",
	popover: "min-w-40 sm:min-w-52 lg:min-w-60",
	listbox: "min-w-40 sm:min-w-52 lg:min-w-60",
};

/**
 * 현재 섹션 context, locale/theme action, Space 선택, logout을 렌더링합니다.
 */
export const TopBar = observer(function TopBar() {
	const router = useRouter();
	const t = useT();
	const app = useApp();
	const topBar = app.ui.header.topBar;
	const space = topBar.space;
	const navigation = topBar.navigation;
	const locale = topBar.locale;
	const { mutate: setCurrentSpaceMutate, isPending: isSettingCurrentSpace } =
		useSetCurrentSpace({
			mutation: {
				onSuccess: (response, variables) => {
					const currentSpace = response.data;
					const selectedSpace = space.spaces.find(
						(space) => space.tenantId === variables.tenantId,
					);
					const nextGroundName =
						currentSpace?.ground?.name ?? selectedSpace?.groundName ?? "";
					const nextContentLanguageCode =
						selectedSpace?.contentLanguageCode ?? null;
					space.setSpace(
						variables.tenantId,
						nextGroundName,
						nextContentLanguageCode,
						currentSpace?.id ?? selectedSpace?.spaceId ?? null,
					);
					window.location.reload();
				},
			},
		});
	const { mutate: nativeLogoutMutate } = useNativeLogout({
		mutation: {
			onSettled: () => {
				space.clear();
				router.replace("/auth/login");
			},
		},
	});

	const onClickLogoutButton = () => {
		if (!space.sessionId) {
			space.clear();
			router.replace("/auth/login");
			return;
		}

		nativeLogoutMutate({
			data: {
				sessionId: space.sessionId,
				refreshToken: space.refreshToken ?? undefined,
			},
		});
	};

	const onSelectSpace = (space: SpaceInfo) => {
		if (isSettingCurrentSpace) {
			return;
		}

		setCurrentSpaceMutate({ tenantId: space.tenantId });
	};

	const onChangeLanguage = (
		languageCode: Parameters<typeof locale.setLanguageCode>[0],
	) => {
		locale.setLanguageCode(languageCode);
	};

	const selectedNavItem = navigation.selectedNavItem;
	const selectedSubNavItem = navigation.selectedSubNavItem;
	const currentSectionLabel =
		selectedSubNavItem?.label ?? selectedNavItem?.label ?? "대시보드";
	const currentSectionCaption =
		selectedSubNavItem && selectedNavItem ? selectedNavItem.label : "현재 섹션";
	const spaceSelectValue = space.spaces.some(
		(spaceItem) => spaceItem.tenantId === space.tenantId,
	)
		? space.tenantId
		: null;
	const spaceOptions = space.spaces.map((spaceItem) => ({
		value: spaceItem.tenantId,
		label: spaceItem.groundName,
	}));

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
					<LanguageSelectButton
						value={locale.languageCode}
						onChange={onChangeLanguage}
						compact
						className={utilityButtonClassName}
					/>
					<ThemeToggleButton compact className={utilityButtonClassName} />
					<Select
						aria-label="Space 선택"
						value={spaceSelectValue}
						placeholder={space.groundName ?? "Space 확인 중"}
						options={spaceOptions}
						isDisabled={space.spaces.length === 0}
						classNames={spaceSelectClassNames}
						onChange={(tenantId) => {
							if (tenantId == null || isSettingCurrentSpace) {
								return;
							}

							const selectedSpace = space.spaces.find(
								(spaceItem) => spaceItem.tenantId === String(tenantId),
							);
							if (selectedSpace && selectedSpace.tenantId !== space.tenantId) {
								onSelectSpace(selectedSpace);
							}
						}}
					/>
				</>
			}
		/>
	);
});
