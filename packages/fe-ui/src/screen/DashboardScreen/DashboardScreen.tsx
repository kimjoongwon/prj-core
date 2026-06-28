"use client";

import { PageTitleBar, Section, SectionSurface, VStack } from "@cocrepo/ui";
import { observer } from "mobx-react-lite";
import { useT } from "../../i18n";

const dashboardCards = [
	{
		label: "오늘 예약",
		value: "-",
	},
	{
		label: "전체 회원",
		value: "-",
	},
	{
		label: "신규 문의",
		value: "-",
	},
	{
		label: "이번 달 매출",
		value: "-",
	},
];

/**
 * 대시보드 페이지
 *
 * 관리자 앱의 기본 랜딩 페이지입니다.
 */
function DashboardScreenContent() {
	const t = useT();
	return (
		<VStack fullWidth>
			<PageTitleBar
				title="대시보드"
				description="관리자 대시보드에 오신 것을 환영합니다."
			/>
			<SectionSurface>
				<Section>
					<Section.Body>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							{dashboardCards.map((card) => (
								<div
									key={card.label}
									className="rounded-xl border border-divider bg-background/60"
								>
									<div className="p-6">
										<h2 className="text-sm font-medium text-muted">
											{t(card.label)}
										</h2>
										<p className="mt-2 text-3xl font-bold">{card.value}</p>
									</div>
								</div>
							))}
						</div>
					</Section.Body>
				</Section>
			</SectionSurface>
		</VStack>
	);
}
export const DashboardScreen = observer(DashboardScreenContent);
