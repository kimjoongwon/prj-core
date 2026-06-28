"use client";

import { LockKeyhole } from "lucide-react";
import { observer } from "mobx-react-lite";
import { Button } from "../../action/Button/Button";
import { useT } from "../../i18n";
import { Section } from "../../layout";
import { VStack } from "../../rhythm";
import { SectionSurface } from "../../surface";
import { PageTitleBar } from "../../widget";
export interface AccessDeniedScreenProps {
	mode: "checking" | "forbidden";
	title: string;
	description: string;
	isScopeAccessible?: boolean;
	onClickBackButton?: () => void;
	onClickDashboardButton?: () => void;
}

/**
 * route replacement boundary에서 사용하는 접근 상태 화면을 렌더링합니다.
 */
export const AccessDeniedScreen = observer(
	({
		mode,
		title,
		description,
		isScopeAccessible = true,
		onClickBackButton,
		onClickDashboardButton,
	}: AccessDeniedScreenProps) => {
		const t = useT();
		if (mode === "checking") {
			return (
				<VStack gap="section" fullWidth>
					<PageTitleBar title={title} description={description} />
					<SectionSurface>
						<Section>
							<Section.Body>
								<div className="flex min-h-[260px] items-center justify-center text-sm text-muted">
									{t("화면 접근 권한을 확인하는 중입니다.")}
								</div>
							</Section.Body>
						</Section>
					</SectionSurface>
				</VStack>
			);
		}
		return (
			<VStack gap="section" fullWidth>
				<PageTitleBar title={title} description={description} />
				<SectionSurface>
					<Section>
						<Section.Body>
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
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
AccessDeniedScreen.displayName = "AccessDeniedScreen";
