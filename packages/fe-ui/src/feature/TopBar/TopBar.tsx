"use client";

import { useNativeLogout, useSetCurrentSpace } from "@cocrepo/api/idp/auth";
import { type SpaceInfo, useApp } from "@cocrepo/store";
import { observer } from "mobx-react-lite";
import { useRouter } from "next/navigation";
import { useT } from "../../i18n";
import { HeaderBar } from "../../widget/HeaderBar";
import { HeaderSpaceSelector } from "../HeaderSpaceSelector";
import { LanguageSelectButton } from "../LanguageSelectButton";
import { ThemeToggleButton } from "../ThemeToggleButton";

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
	const app = useApp();
	const topBar = app.ui.header.topBar;
	const space = topBar.space;
	const navigation = topBar.navigation;
	const locale = topBar.locale;
	if (!space || !navigation) {
		throw new Error("TopBar에 필요한 app 상태가 초기화되지 않았습니다.");
	}
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
		languageCode: Parameters<NonNullable<typeof locale>["setLanguageCode"]>[0],
	) => {
		locale?.setLanguageCode(languageCode);
	};

	const selectedNavItem = navigation.selectedNavItem;
	const selectedSubNavItem = navigation.selectedSubNavItem;
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
					{locale && (
						<LanguageSelectButton
							value={locale.languageCode}
							onChange={onChangeLanguage}
							compact
							className={utilityButtonClassName}
						/>
					)}
					<ThemeToggleButton compact className={utilityButtonClassName} />
					<HeaderSpaceSelector
						spaces={space.spaces}
						currentTenantId={space.tenantId}
						currentSpaceName={space.groundName}
						onSpaceSelect={onSelectSpace}
					/>
				</>
			}
		/>
	);
});
