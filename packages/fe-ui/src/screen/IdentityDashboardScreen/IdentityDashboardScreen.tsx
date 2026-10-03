"use client";

import {
	HStack,
	Screen,
	Section,
	SectionSurface,
	Typography,
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
import { useT } from "../../i18n";

/**
 * 통계 카드 설정
 */
interface StatCardConfig {
	label: string;
	key: keyof IdentityDashboardScreenStats;
	icon: ReactNode;
	color: string;
	bgColor: string;
}
export interface IdentityDashboardScreenStats {
	activeSessionCount: number;
	todaySuccessCount: number;
	todayFailureCount: number;
	todayLockedCount: number;
	lockedAccountCount: number;
	activeClientCount: number;
}
export interface IdentityDashboardScreenTrendItem {
	date: string;
	successCount: number;
	failureCount: number;
}
export interface IdentityDashboardScreenProps {
	stats?: IdentityDashboardScreenStats;
	trendItems: IdentityDashboardScreenTrendItem[];
}
const statCards: StatCardConfig[] = [
	{
		label: "활성 세션",
		key: "activeSessionCount",
		icon: <Activity className="h-5 w-5" />,
		color: "text-accent",
		bgColor: "bg-accent/10",
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
		color: "text-accent",
		bgColor: "bg-default/10",
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
 * IDP 대시보드 pure screen입니다.
 */
export const IdentityDashboardScreen = observer(
	({ stats, trendItems }: IdentityDashboardScreenProps) => {
		const t = useT();
		// 바 차트 최대값 계산
		const maxTrendValue = trendItems.reduce((max, item) => {
			return Math.max(max, item.successCount, item.failureCount);
		}, 0);
		return (
			<VStack fullWidth>
				<Screen.Header
					title="대시보드"
					description="IDP 인증 시스템 현황을 한눈에 확인합니다."
				/>
				<SectionSurface>
					<Section>
						<Section.Body>
							<VStack>
								<Section>
									<Section.Header
										title="주요 지표"
										description="세션, 성공/실패 로그인, 잠금 상태를 요약합니다."
									/>
									<Section.Body>
										<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
											{statCards.map((card) => (
												<div
													key={card.key}
													className="rounded-xl bg-surface-secondary p-4"
												>
													<div
														className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bgColor} ${card.color}`}
													>
														{card.icon}
													</div>
													<div>
														<Typography.Paragraph size="sm" color="muted">
															{t(card.label)}
														</Typography.Paragraph>
														<Typography.Heading
															level={3}
															className={card.color}
														>
															{stats?.[card.key] ?? 0}
														</Typography.Heading>
													</div>
												</div>
											))}
										</div>
									</Section.Body>
								</Section>
								<Section>
									<Section.Header title="최근 7일 로그인 추이" />
									<Section.Body>
										{trendItems.length === 0 ? (
											<Typography.Paragraph
												color="muted"
												className="py-8 text-center"
											>
												{t("로그인 추이 데이터가 없습니다.")}
											</Typography.Paragraph>
										) : (
											<VStack gap="section">
												<HStack alignItems="center" gap="section">
													<HStack alignItems="center" gap="dense">
														<div className="h-3 w-3 rounded-sm bg-success" />
														<Typography
															type="body-sm"
															color="muted"
														>
															{t("성공")}
														</Typography>
													</HStack>
													<HStack alignItems="center" gap="dense">
														<div className="h-3 w-3 rounded-sm bg-danger" />
														<Typography
															type="body-sm"
															color="muted"
														>
															{t("실패")}
														</Typography>
													</HStack>
												</HStack>
												<HStack alignItems="end" gap="block" className="h-50">
													{trendItems.map((item, index) => (
														<VStack
															key={`${item.date}:${index}`}
															gap="dense"
															alignItems="center"
															className="flex-1 h-full"
														>
															<HStack
																alignItems="end"
																justifyContent="center"
																gap="dense"
																className="flex-1 h-full w-full"
															>
																<div
																	className="flex flex-col items-center justify-end"
																	style={{
																		height: "100%",
																	}}
																>
																	<Typography
																		type="body-xs"
																		color="muted"
																		className="mb-1"
																	>
																		{item.successCount}
																	</Typography>
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
																	<Typography
																		type="body-xs"
																		color="muted"
																		className="mb-1"
																	>
																		{item.failureCount}
																	</Typography>
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
															</HStack>
															<Typography
																type="body-xs"
																color="muted"
																className="mt-1"
															>
																{formatShortDate(item.date)}
															</Typography>
														</VStack>
													))}
												</HStack>
											</VStack>
										)}
									</Section.Body>
								</Section>
							</VStack>
						</Section.Body>
					</Section>
				</SectionSurface>
			</VStack>
		);
	},
);
