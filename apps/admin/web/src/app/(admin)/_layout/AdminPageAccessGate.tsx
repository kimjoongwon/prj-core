"use client";

import { useVerifyToken } from "@cocrepo/api/idp/auth";
import {
	ADMIN_PATHS,
	isScopeKindAccessible,
	matchAdminPageAccessItem,
} from "@cocrepo/constant";
import { useAbility } from "@cocrepo/store";
import {
	DetailPage,
	DetailPageSurface,
	DetailSectionCard,
	PageTitleBar,
	useT,
} from "@cocrepo/ui";
import { Button } from "@cocrepo/ui/heroui";
import { LockKeyhole } from "lucide-react";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { usePersistStore } from "@/stores/AppStoreProvider";

export const AdminPageAccessGate = observer(function AdminPageAccessGate({
	children,
}: {
	children: ReactNode;
}) {
	const pathname = usePathname();
	const router = useRouter();
	const persistStore = usePersistStore();
	const t = useT();
	const { can, isLoaded } = useAbility();
	const shouldVerifyCurrentTenant =
		persistStore.isHydrated && persistStore.isSpaceSelectionResolved;
	const { data: verifyTokenResponse, isPending: isVerifyingToken } =
		useVerifyToken({
			query: {
				enabled: shouldVerifyCurrentTenant,
				queryKey: ["/api/v1/auth/verify-token", persistStore.spaceId],
				retry: false,
				refetchOnWindowFocus: false,
			},
		});
	const hasFullAccessRole = verifyTokenResponse?.data?.hasFullAccess === true;

	if (!pathname) {
		return children;
	}

	const pageAccessItem = matchAdminPageAccessItem(pathname);
	if (!pageAccessItem) {
		return children;
	}

	if (
		!shouldVerifyCurrentTenant ||
		isVerifyingToken ||
		(!isLoaded && !hasFullAccessRole)
	) {
		return (
			<DetailPage
				top={
					<PageTitleBar
						title="권한 확인 중"
						description="현재 화면 접근 권한을 확인하고 있습니다."
					/>
				}
			>
				<DetailPageSurface>
					<DetailSectionCard>
						<div className="flex min-h-[260px] items-center justify-center text-sm text-default-500">
							{t("화면 접근 권한을 확인하는 중입니다.")}
						</div>
					</DetailSectionCard>
				</DetailPageSurface>
			</DetailPage>
		);
	}

	const isScopeAccessible = isScopeKindAccessible(
		pageAccessItem.scopeKind,
		hasFullAccessRole,
	);

	if (
		isScopeAccessible &&
		(hasFullAccessRole || can("view", pageAccessItem.subject))
	) {
		return children;
	}

	const forbiddenDescription = isScopeAccessible
		? `${t(pageAccessItem.pageLabel)} ${t("화면을 열 수 있는 화면 접근 권한이 현재 선택한 Space 권한에 없습니다.")}`
		: `${t(pageAccessItem.pageLabel)} ${t("화면은 현재 선택한 tenant role이 FULL_ACCESS일 때만 열 수 있습니다.")}`;

	return (
		<DetailPage
			top={
				<PageTitleBar
					title="접근 권한이 없습니다"
					description={forbiddenDescription}
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
								{t("이 화면은 현재 선택한 Space 권한으로 열 수 없습니다.")}
							</p>
							<p className="max-w-xl text-sm text-default-500">
								{isScopeAccessible
									? t(
											"메뉴 노출 권한이 있어도 화면 접근 권한이 따로 꺼져 있으면 URL 직접 접근은 막힙니다. 역할 상세의 화면 접근 섹션에서 해당 페이지를 켜면 다시 열 수 있습니다.",
										)
									: t(
											"현재 선택한 tenant role이 FULL_ACCESS가 아니면 global 관리 화면은 열 수 없습니다. 헤더에서 FULL_ACCESS tenant로 전환한 뒤 다시 시도해 주세요.",
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
								onPress={() => router.push(ADMIN_PATHS.DASHBOARD)}
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
