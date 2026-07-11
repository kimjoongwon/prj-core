"use client";

import { useVerifyToken } from "@cocrepo/api/idp/auth";
import {
	ADMIN_PATHS,
	isScopeKindAccessible,
	matchAdminPageAccessItem,
} from "@cocrepo/constant";
import { useApp } from "@cocrepo/store";
import { LockKeyhole } from "lucide-react";
import { observer } from "mobx-react-lite";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Typography } from "../../../../data-display/Typography";
import { useT } from "../../../../i18n";
import { Button } from "../../../../input/Button/Button";
import { Surface } from "../../../../surface/Surface";

/** 접근 제어 guard가 허용 시 렌더링할 콘텐츠 계약입니다. */
export interface AccessControlGuardProps {
	contents: ReactNode;
}

/** 현재 route 접근 권한을 확인하고 허용 콘텐츠 또는 접근 상태 UI를 렌더링합니다. */
export const AccessControlGuard = observer(function AccessControlGuard({
	contents,
}: AccessControlGuardProps) {
	const pathname = usePathname();
	const router = useRouter();
	const app = useApp();
	const account = app.account;
	const { authSession } = account;
	const accessControl = app.accessControl;
	const t = useT();

	const shouldVerifyCurrentTenant =
		authSession.isHydrated && account.isHydrated && account.isSelectionResolved;
	const { data: verifyTokenResponse, isPending: isVerifyingToken } =
		useVerifyToken({
			query: {
				enabled: shouldVerifyCurrentTenant,
				queryKey: ["/api/v1/auth/verify-token", account.currentTenantId],
				retry: false,
				refetchOnWindowFocus: false,
			},
		});
	const hasFullAccessRole = verifyTokenResponse?.data?.hasFullAccess === true;

	if (!pathname) {
		return contents;
	}

	const pageAccessItem = matchAdminPageAccessItem(pathname);
	if (!pageAccessItem) {
		return contents;
	}

	if (
		!shouldVerifyCurrentTenant ||
		isVerifyingToken ||
		(!accessControl.isLoaded && !hasFullAccessRole)
	) {
		return (
			<div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4">
				<div className="min-w-0 border-b border-[#d7e4f2] pb-4 dark:border-white/10">
					<Typography.Heading
						className="text-2xl font-semibold leading-8"
						level={1}
					>
						{t("권한 확인 중")}
					</Typography.Heading>
					<Typography.Paragraph className="mt-1" color="muted" size="sm">
						{t("현재 화면 접근 권한을 확인하고 있습니다.")}
					</Typography.Paragraph>
				</div>
				<Surface>
					<div className="flex min-h-[260px] items-center justify-center p-4 text-sm text-muted md:p-5">
						{t("화면 접근 권한을 확인하는 중입니다.")}
					</div>
				</Surface>
			</div>
		);
	}

	const isScopeAccessible = isScopeKindAccessible(
		pageAccessItem.scopeKind,
		hasFullAccessRole,
	);

	if (
		isScopeAccessible &&
		(hasFullAccessRole || accessControl.can("view", pageAccessItem.subject))
	) {
		return contents;
	}

	const forbiddenDescription = isScopeAccessible
		? `${t(pageAccessItem.pageLabel)} ${t("화면을 열 수 있는 화면 접근 권한이 현재 선택한 Space 권한에 없습니다.")}`
		: `${t(pageAccessItem.pageLabel)} ${t("화면은 현재 선택한 tenant role이 PLATFORM_ADMIN일 때만 열 수 있습니다.")}`;

	/** 접근 권한이 없을 때 이전 화면으로 돌아갑니다. */
	const onClickBackButton = () => {
		router.back();
	};

	/** 접근 권한이 없을 때 dashboard 화면으로 이동합니다. */
	const onClickDashboardButton = () => {
		router.push(ADMIN_PATHS.DASHBOARD);
	};

	return (
		<div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4">
			<div className="min-w-0 border-b border-[#d7e4f2] pb-4 dark:border-white/10">
				<Typography.Heading
					className="text-2xl font-semibold leading-8"
					level={1}
				>
					{t("접근 권한이 없습니다")}
				</Typography.Heading>
				<Typography.Paragraph className="mt-1" color="muted" size="sm">
					{forbiddenDescription}
				</Typography.Paragraph>
			</div>
			<Surface>
				<div className="flex min-h-[280px] flex-col items-center justify-center gap-4 px-6 py-10 text-center">
					<div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-50 text-danger dark:bg-danger-900/20">
						<LockKeyhole className="h-6 w-6" />
					</div>
					<div className="space-y-2">
						<p className="text-base font-semibold">
							{t("이 화면은 현재 선택한 Space 권한으로 열 수 없습니다.")}
						</p>
						<p className="max-w-xl text-sm text-muted">
							{isScopeAccessible
								? t(
										"메뉴 노출 권한이 있어도 화면 접근 권한이 따로 꺼져 있으면 URL 직접 접근은 막힙니다. 역할 상세의 화면 접근 섹션에서 해당 페이지를 켜면 다시 열 수 있습니다.",
									)
								: t(
										"현재 선택한 tenant role이 PLATFORM_ADMIN이 아니면 global 관리 화면은 열 수 없습니다. 헤더에서 PLATFORM_ADMIN tenant로 전환한 뒤 다시 시도해 주세요.",
									)}
						</p>
					</div>
					<div className="flex gap-2">
						<Button variant="flat" onPress={onClickBackButton}>
							{t("이전 화면")}
						</Button>
						<Button
							color="primary"
							variant="flat"
							onPress={onClickDashboardButton}
						>
							{t("대시보드로 이동")}
						</Button>
					</div>
				</div>
			</Surface>
		</div>
	);
});

AccessControlGuard.displayName = "AccessControlGuard";
