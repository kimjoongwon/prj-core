"use client";

import {
	Screen,
	Section,
	SectionSurface,
	Typography,
	VStack,
} from "@cocrepo/ui";
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
			<Screen.Header
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
									className="rounded-xl border border-divider bg-background"
								>
									<div className="p-6">
										<h2>
											<Typography type="body-sm" weight="medium" color="muted">
												{t(card.label)}
											</Typography>
										</h2>
										<Typography.Heading
											level={3}
											weight="bold"
											className="mt-2"
										>
											{card.value}
										</Typography.Heading>
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
