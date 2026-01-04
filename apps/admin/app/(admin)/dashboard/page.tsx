"use client";

import { Text } from "@cocrepo/ui";
import { Card, CardBody } from "@heroui/react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

// Mock 데이터 - 주간 회원 가입 추이
const weeklySignupData = [
	{ name: "월", count: 24 },
	{ name: "화", count: 35 },
	{ name: "수", count: 28 },
	{ name: "목", count: 42 },
	{ name: "금", count: 38 },
	{ name: "토", count: 55 },
	{ name: "일", count: 48 },
];

// Mock 데이터 - 월별 예약 추이
const monthlyReservationData = [
	{ name: "1월", count: 120 },
	{ name: "2월", count: 150 },
	{ name: "3월", count: 180 },
	{ name: "4월", count: 220 },
	{ name: "5월", count: 280 },
	{ name: "6월", count: 320 },
];

// Mock 데이터 - 예약 상태 분포
const reservationStatusData = [
	{ name: "확정", value: 320, color: "#22c55e" },
	{ name: "대기", value: 85, color: "#f59e0b" },
	{ name: "취소", value: 45, color: "#ef4444" },
	{ name: "완료", value: 180, color: "#3b82f6" },
];

// Mock 데이터 - 일일 방문자 수
const dailyVisitorData = [
	{ name: "00:00", count: 12 },
	{ name: "04:00", count: 8 },
	{ name: "08:00", count: 45 },
	{ name: "12:00", count: 78 },
	{ name: "16:00", count: 92 },
	{ name: "20:00", count: 65 },
	{ name: "24:00", count: 28 },
];

/**
 * 대시보드 페이지
 * 관리자가 시스템 현황을 한눈에 확인할 수 있는 대시보드
 */
export default function DashboardPage() {
	return (
		<div className="flex flex-col gap-6 p-6">
			{/* 헤더 */}
			<div className="flex flex-col gap-2">
				<Text className="text-3xl font-bold">대시보드</Text>
				<Text className="text-default-500">
					시스템 현황을 한눈에 확인하세요
				</Text>
			</div>

			{/* 통계 카드 */}
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatCard
					title="총 회원 수"
					value="1,234"
					change="+12%"
					changeType="increase"
					icon="👥"
				/>
				<StatCard
					title="이번 달 예약"
					value="320"
					change="+8%"
					changeType="increase"
					icon="📅"
				/>
				<StatCard
					title="대기 중 예약"
					value="85"
					change="-5%"
					changeType="decrease"
					icon="⏰"
				/>
				<StatCard
					title="이번 달 매출"
					value="₩12.5M"
					change="+15%"
					changeType="increase"
					icon="💰"
				/>
			</div>

			{/* 차트 섹션 */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* 주간 회원 가입 추이 */}
				<Card>
					<CardBody className="gap-4 p-6">
						<div className="flex flex-col gap-1">
							<Text className="text-lg font-semibold">주간 회원 가입 추이</Text>
							<Text className="text-sm text-default-500">
								최근 7일간 신규 회원 가입 현황
							</Text>
						</div>
						<ResponsiveContainer width="100%" height={300}>
							<AreaChart data={weeklySignupData}>
								<defs>
									<linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
										<stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
										<stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
									</linearGradient>
								</defs>
								<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
								<XAxis dataKey="name" stroke="#6b7280" />
								<YAxis stroke="#6b7280" />
								<Tooltip
									contentStyle={{
										backgroundColor: "#fff",
										border: "1px solid #e5e7eb",
										borderRadius: "8px",
									}}
								/>
								<Area
									type="monotone"
									dataKey="count"
									stroke="#3b82f6"
									fillOpacity={1}
									fill="url(#colorCount)"
								/>
							</AreaChart>
						</ResponsiveContainer>
					</CardBody>
				</Card>

				{/* 월별 예약 추이 */}
				<Card>
					<CardBody className="gap-4 p-6">
						<div className="flex flex-col gap-1">
							<Text className="text-lg font-semibold">월별 예약 추이</Text>
							<Text className="text-sm text-default-500">
								최근 6개월간 예약 건수
							</Text>
						</div>
						<ResponsiveContainer width="100%" height={300}>
							<BarChart data={monthlyReservationData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
								<XAxis dataKey="name" stroke="#6b7280" />
								<YAxis stroke="#6b7280" />
								<Tooltip
									contentStyle={{
										backgroundColor: "#fff",
										border: "1px solid #e5e7eb",
										borderRadius: "8px",
									}}
								/>
								<Bar dataKey="count" fill="#3b82f6" radius={[8, 8, 0, 0]} />
							</BarChart>
						</ResponsiveContainer>
					</CardBody>
				</Card>

				{/* 예약 상태 분포 */}
				<Card>
					<CardBody className="gap-4 p-6">
						<div className="flex flex-col gap-1">
							<Text className="text-lg font-semibold">예약 상태 분포</Text>
							<Text className="text-sm text-default-500">
								현재 예약 상태별 분포 현황
							</Text>
						</div>
						<ResponsiveContainer width="100%" height={300}>
							<PieChart>
								<Pie
									data={reservationStatusData}
									cx="50%"
									cy="50%"
									labelLine={false}
									label={renderCustomizedLabel}
									outerRadius={100}
									fill="#8884d8"
									dataKey="value"
								>
									{reservationStatusData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip
									contentStyle={{
										backgroundColor: "#fff",
										border: "1px solid #e5e7eb",
										borderRadius: "8px",
									}}
								/>
								<Legend />
							</PieChart>
						</ResponsiveContainer>
					</CardBody>
				</Card>

				{/* 일일 방문자 추이 */}
				<Card>
					<CardBody className="gap-4 p-6">
						<div className="flex flex-col gap-1">
							<Text className="text-lg font-semibold">일일 방문자 추이</Text>
							<Text className="text-sm text-default-500">
								오늘 시간대별 방문자 수
							</Text>
						</div>
						<ResponsiveContainer width="100%" height={300}>
							<LineChart data={dailyVisitorData}>
								<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
								<XAxis dataKey="name" stroke="#6b7280" />
								<YAxis stroke="#6b7280" />
								<Tooltip
									contentStyle={{
										backgroundColor: "#fff",
										border: "1px solid #e5e7eb",
										borderRadius: "8px",
									}}
								/>
								<Line
									type="monotone"
									dataKey="count"
									stroke="#8b5cf6"
									strokeWidth={2}
									dot={{ fill: "#8b5cf6", r: 4 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</CardBody>
				</Card>
			</div>
		</div>
	);
}

/**
 * 통계 카드 컴포넌트
 */
interface StatCardProps {
	title: string;
	value: string;
	change: string;
	changeType: "increase" | "decrease";
	icon: string;
}

function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
	const changeColor =
		changeType === "increase" ? "text-success" : "text-danger";

	return (
		<Card>
			<CardBody className="gap-3 p-6">
				<div className="flex items-start justify-between">
					<div className="flex flex-col gap-1">
						<Text className="text-sm text-default-500">{title}</Text>
						<Text className="text-2xl font-bold">{value}</Text>
					</div>
					<div className="text-3xl">{icon}</div>
				</div>
				<Text className={`text-sm font-medium ${changeColor}`}>
					{change} <span className="text-default-400">vs 지난 달</span>
				</Text>
			</CardBody>
		</Card>
	);
}

/**
 * Pie 차트 라벨 렌더링 함수
 */
const RADIAN = Math.PI / 180;
function renderCustomizedLabel({
	cx,
	cy,
	midAngle,
	innerRadius,
	outerRadius,
	percent,
}: {
	cx?: number;
	cy?: number;
	midAngle?: number;
	innerRadius?: number;
	outerRadius?: number;
	percent?: number;
}) {
	// 필수 값이 없으면 렌더링하지 않음
	if (
		cx === undefined ||
		cy === undefined ||
		midAngle === undefined ||
		innerRadius === undefined ||
		outerRadius === undefined ||
		percent === undefined
	) {
		return null;
	}

	const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
	const x = cx + radius * Math.cos(-midAngle * RADIAN);
	const y = cy + radius * Math.sin(-midAngle * RADIAN);

	return (
		<text
			x={x}
			y={y}
			fill="white"
			textAnchor={x > cx ? "start" : "end"}
			dominantBaseline="central"
			className="text-sm font-semibold"
		>
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	);
}
