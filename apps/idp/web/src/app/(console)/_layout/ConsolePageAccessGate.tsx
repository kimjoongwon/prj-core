"use client";

import { IDP_PATHS, matchIdpScreenScopeItem } from "@cocrepo/constant";
import { useAbility, useConsolePersistStore } from "@cocrepo/store";
import {
	DetailPage,
	DetailPageSurface,
	DetailSectionCard,
	PageTitleBar,
	useT,
} from "@cocrepo/ui";
import { Button } from "@heroui/react";
import { LockKeyhole } from "lucide-react";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

export const ConsolePageAccessGate = observer(function ConsolePageAccessGate({
	children,
}: {
	children: ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const t = useT();
	const persistStore = useConsolePersistStore();
	const { can, isLoaded } = useAbility();

	if (!pathname) {
		return children;
	}

	const screenScopeItem = matchIdpScreenScopeItem(pathname);
	if (!screenScopeItem) {
		return children;
	}

	if (!persistStore.isSpaceSelectionResolved || !isLoaded) {
		return (
			<DetailPage
				top={
					<PageTitleBar
						title="권한 확인 중"
						description="현재 화면 접근 범위를 확인하고 있습니다."
					/>
				}
			>
				<DetailPageSurface>
					<DetailSectionCard>
						<div className="flex min-h-[260px] items-center justify-center text-sm text-default-500">
							{t("현재 tenant 범위와 화면 접근 권한을 확인하는 중입니다.")}
						</div>
					</DetailSectionCard>
				</DetailPageSurface>
			</DetailPage>
		);
	}

	if (can("view", screenScopeItem.subject)) {
		return children;
	}

	return (
		<DetailPage
			top={
				<PageTitleBar
					title="접근 권한이 없습니다"
					description={t(
						"{{pageLabel}} 화면은 현재 tenant 범위에서 열 수 없습니다.",
						undefined,
						{ pageLabel: t(screenScopeItem.pageLabel) },
					)}
				/>
			}
		>
			<DetailPageSurface>
				<DetailSectionCard>
					<div className="flex min-h-[280px] flex-col items-center justify-center gap-4 px-6 py-10 text-center">
						<div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-50 text-danger dark:bg-danger-900/20">
							<LockKeyhole className="h-6 w-6" />
						</div>
						<div className="space-y-2">
							<p className="text-base font-semibold">
								{t("현재 선택한 tenant 범위로는 이 화면을 열 수 없습니다.")}
							</p>
							<p className="max-w-xl text-sm text-default-500">
								{t(
									"global 관리 화면은 현재 tenant role이 FULL_ACCESS일 때만 열리고, 그 외 화면은 현재 선택한 Space 기준으로 범위가 제한됩니다.",
								)}
							</p>
						</div>
						<div className="flex gap-2">
							<Button variant="flat" onPress={() => router.back()}>
								{t("이전 화면")}
							</Button>
							<Button
								color="primary"
								variant="flat"
								onPress={() => router.push(IDP_PATHS.DASHBOARD)}
							>
								{t("대시보드로 이동")}
							</Button>
						</div>
					</div>
				</DetailSectionCard>
			</DetailPageSurface>
		</DetailPage>
	);
});
