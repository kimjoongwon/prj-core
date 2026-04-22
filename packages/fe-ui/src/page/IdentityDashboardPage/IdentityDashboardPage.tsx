"use client";

import {
	DetailPage,
	DetailPageSurface,
	DetailSection,
	DetailSectionCard,
	PageTitleBar,
	VStack,
} from "@cocrepo/ui";
import {
	Activity,
	CheckCircle,
	KeyRound,
	Lock,
	UserX,
	XCircle,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";

/**
 * 통계 카드 설정
 */
interface StatCardConfig {
	label: string;
	key: keyof IdentityDashboardPageStats;
	icon: ReactNode;
	color: string;
	bgColor: string;
}

export interface IdentityDashboardPageStats {
	activeSessionCount: number;
	todaySuccessCount: number;
	todayFailureCount: number;
	todayLockedCount: number;
	lockedAccountCount: number;
	activeClientCount: number;
}

export interface IdentityDashboardPageTrendItem {
	date: string;
	successCount: number;
	failureCount: number;
}

export interface IdentityDashboardPageProps {
	stats?: IdentityDashboardPageStats;
	trendItems: IdentityDashboardPageTrendItem[];
}

const statCards: StatCardConfig[] = [
	{
		label: "활성 세션",
		key: "activeSessionCount",
		icon: <Activity className="h-5 w-5" />,
		color: "text-primary",
		bgColor: "bg-primary/10",
	},
	{
		label: "오늘 성공",
		key: "todaySuccessCount",
		icon: <CheckCircle className="h-5 w-5" />,
		color: "text-success",
		bgColor: "bg-success/10",
	},
	{
		label: "오늘 실패",
		key: "todayFailureCount",
		icon: <XCircle className="h-5 w-5" />,
		color: "text-danger",
		bgColor: "bg-danger/10",
	},
	{
		label: "오늘 잠금",
		key: "todayLockedCount",
		icon: <Lock className="h-5 w-5" />,
		color: "text-warning",
		bgColor: "bg-warning/10",
	},
	{
		label: "잠금 계정",
		key: "lockedAccountCount",
		icon: <UserX className="h-5 w-5" />,
		color: "text-danger",
		bgColor: "bg-danger/10",
	},
	{
		label: "활성 클라이언트",
		key: "activeClientCount",
		icon: <KeyRound className="h-5 w-5" />,
		color: "text-secondary",
		bgColor: "bg-secondary/10",
	},
];

/**
 * 바 차트에서 최대값 대비 비율을 계산합니다.
 */
function getBarHeight(value: number, maxValue: number): string {
	if (maxValue === 0) return "0%";
	const percentage = (value / maxValue) * 100;
	return `${Math.max(percentage, 4)}%`;
}

/**
 * 날짜 문자열에서 월/일만 추출합니다.
 */
function formatShortDate(dateStr: string): string {
	const date = new Date(dateStr);
	return `${date.getMonth() + 1}/${date.getDate()}`;
}

/**
 * IDP 대시보드 pure page입니다.
 */
export const IdentityDashboardPage = observer(({
		stats,
		trendItems,
	}: IdentityDashboardPageProps) => {
		// 바 차트 최대값 계산
		const maxTrendValue = trendItems.reduce((max, item) => {
			return Math.max(max, item.successCount, item.failureCount);
		}, 0);

		return (
			<DetailPage
				top={
					<PageTitleBar
						title="대시보드"
						description="IDP 인증 시스템 현황을 한눈에 확인합니다."
					/>
				}
			>
				<DetailPageSurface>
					<VStack gap={4}>
						<DetailSectionCard>
							<DetailSection
								top={
									<PageTitleBar
										level={2}
										title="주요 지표"
										description="세션, 성공/실패 로그인, 잠금 상태를 요약합니다."
									/>
								}
							>
								<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
									{statCards.map((card) => (
										<div key={card.key} className="rounded-xl bg-content2 p-4">
											<div
												className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bgColor} ${card.color}`}
											>
												{card.icon}
											</div>
											<div>
												<p className="text-sm text-default-500">{card.label}</p>
												<p className={`text-2xl font-bold ${card.color}`}>
													{stats?.[card.key] ?? 0}
												</p>
											</div>
										</div>
									))}
								</div>
							</DetailSection>
						</DetailSectionCard>
						<DetailSectionCard>
							<DetailSection
								top={<PageTitleBar level={2} title="최근 7일 로그인 추이" />}
							>
								{trendItems.length === 0 ? (
									<p className="py-8 text-center text-default-400">
										로그인 추이 데이터가 없습니다.
									</p>
								) : (
									<div className="flex flex-col gap-4">
										<div className="flex items-center gap-4">
											<div className="flex items-center gap-1.5">
												<div className="h-3 w-3 rounded-sm bg-success" />
												<span className="text-sm text-default-500">성공</span>
											</div>
											<div className="flex items-center gap-1.5">
												<div className="h-3 w-3 rounded-sm bg-danger" />
												<span className="text-sm text-default-500">실패</span>
											</div>
										</div>
										<div
											className="flex items-end gap-3"
											style={{
												height: 200,
											}}
										>
											{trendItems.map((item) => (
												<div
													key={`${item.date}:${item.successCount}:${item.failureCount}`}
													className="flex flex-1 flex-col items-center gap-1"
													style={{
														height: "100%",
													}}
												>
													<div
														className="flex flex-1 items-end gap-1 w-full justify-center"
														style={{
															height: "100%",
														}}
													>
														<div
															className="flex flex-col items-center justify-end"
															style={{
																height: "100%",
															}}
														>
															<span className="mb-1 text-xs text-default-400">
																{item.successCount}
															</span>
															<div
																className="w-6 rounded-t-md bg-success transition-all md:w-8"
																style={{
																	height: getBarHeight(
																		item.successCount,
																		maxTrendValue,
																	),
																}}
															/>
														</div>
														<div
															className="flex flex-col items-center justify-end"
															style={{
																height: "100%",
															}}
														>
															<span className="mb-1 text-xs text-default-400">
																{item.failureCount}
															</span>
															<div
																className="w-6 rounded-t-md bg-danger transition-all md:w-8"
																style={{
																	height: getBarHeight(
																		item.failureCount,
																		maxTrendValue,
																	),
																}}
															/>
														</div>
													</div>
													<span className="mt-1 text-xs text-default-500">
														{formatShortDate(item.date)}
													</span>
												</div>
											))}
										</div>
									</div>
								)}
							</DetailSection>
						</DetailSectionCard>
					</VStack>
				</DetailPageSurface>
			</DetailPage>
		);
	});
