"use client";

import {
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
	Tab,
	Tabs,
} from "@heroui/react";
import { MermaidChart } from "../../components/MermaidChart";

const wbsMainChart = `
flowchart TB
    ROOT[예약 서비스]

    ROOT --> A[1. 기획 및 분석]
    ROOT --> B[2. 설계]
    ROOT --> C[3. 백엔드 개발]
    ROOT --> D[4. 프론트엔드 개발]
    ROOT --> E[5. 테스트 및 QA]
    ROOT --> F[6. 배포 및 운영]

    A --> A1[1.1 요구사항 정의]
    A --> A2[1.2 기능 명세서 작성]
    A --> A3[1.3 화면 설계]

    B --> B1[2.1 DB 스키마 설계]
    B --> B2[2.2 API 설계]
    B --> B3[2.3 아키텍처 설계]

    C --> C1[3.1 예약 모듈]
    C --> C2[3.2 결제 연동]
    C --> C3[3.3 알림 시스템]

    D --> D1[4.1 예약 페이지]
    D --> D2[4.2 관리자 페이지]
    D --> D3[4.3 마이페이지]

    E --> E1[5.1 단위 테스트]
    E --> E2[5.2 통합 테스트]
    E --> E3[5.3 사용자 테스트]

    F --> F1[6.1 스테이징 배포]
    F --> F2[6.2 프로덕션 배포]
    F --> F3[6.3 모니터링 설정]
`;

const wbsBackendChart = `
flowchart TB
    BE[백엔드 개발]

    BE --> RES[예약 모듈]
    BE --> PAY[결제 연동]
    BE --> NOTI[알림 시스템]
    BE --> AUTH[인증/인가]

    RES --> RES1[예약 CRUD API]
    RES --> RES2[가용성 확인 로직]
    RES --> RES3[예약 상태 관리]
    RES --> RES4[취소/환불 처리]

    PAY --> PAY1[PG사 연동]
    PAY --> PAY2[결제 검증]
    PAY --> PAY3[환불 처리]

    NOTI --> NOTI1[이메일 발송]
    NOTI --> NOTI2[SMS 발송]
    NOTI --> NOTI3[푸시 알림]

    AUTH --> AUTH1[JWT 인증]
    AUTH --> AUTH2[권한 관리]
`;

const wbsFrontendChart = `
flowchart TB
    FE[프론트엔드 개발]

    FE --> BOOK[예약 페이지]
    FE --> ADMIN[관리자 페이지]
    FE --> MY[마이페이지]
    FE --> COMMON[공통 컴포넌트]

    BOOK --> BOOK1[서비스 선택]
    BOOK --> BOOK2[일정 선택 캘린더]
    BOOK --> BOOK3[예약 정보 입력]
    BOOK --> BOOK4[결제 페이지]
    BOOK --> BOOK5[예약 완료 페이지]

    ADMIN --> ADMIN1[예약 현황 대시보드]
    ADMIN --> ADMIN2[예약 관리 목록]
    ADMIN --> ADMIN3[서비스/상품 관리]
    ADMIN --> ADMIN4[일정 관리]

    MY --> MY1[예약 내역 조회]
    MY --> MY2[예약 상세 보기]
    MY --> MY3[예약 취소/변경]

    COMMON --> COMMON1[캘린더 컴포넌트]
    COMMON --> COMMON2[타임슬롯 선택]
    COMMON --> COMMON3[예약 카드]
`;

const wbsData = [
	{
		id: "1",
		name: "기획 및 분석",
		children: [
			{
				id: "1.1",
				name: "요구사항 정의",
				duration: "3일",
				status: "completed",
			},
			{
				id: "1.2",
				name: "기능 명세서 작성",
				duration: "2일",
				status: "completed",
			},
			{
				id: "1.3",
				name: "화면 설계 (와이어프레임)",
				duration: "3일",
				status: "in-progress",
			},
		],
	},
	{
		id: "2",
		name: "설계",
		children: [
			{ id: "2.1", name: "DB 스키마 설계", duration: "2일", status: "pending" },
			{
				id: "2.2",
				name: "API 설계 (OpenAPI)",
				duration: "2일",
				status: "pending",
			},
			{
				id: "2.3",
				name: "시스템 아키텍처 설계",
				duration: "1일",
				status: "pending",
			},
		],
	},
	{
		id: "3",
		name: "백엔드 개발",
		children: [
			{ id: "3.1", name: "예약 CRUD API", duration: "5일", status: "pending" },
			{
				id: "3.2",
				name: "가용성 확인 로직",
				duration: "3일",
				status: "pending",
			},
			{
				id: "3.3",
				name: "결제 연동 (PG사)",
				duration: "5일",
				status: "pending",
			},
			{
				id: "3.4",
				name: "알림 시스템 (이메일/SMS)",
				duration: "3일",
				status: "pending",
			},
			{ id: "3.5", name: "인증/인가", duration: "2일", status: "pending" },
		],
	},
	{
		id: "4",
		name: "프론트엔드 개발",
		children: [
			{
				id: "4.1",
				name: "예약 페이지 (캘린더, 타임슬롯)",
				duration: "7일",
				status: "pending",
			},
			{ id: "4.2", name: "결제 페이지", duration: "3일", status: "pending" },
			{
				id: "4.3",
				name: "관리자 대시보드",
				duration: "5일",
				status: "pending",
			},
			{
				id: "4.4",
				name: "마이페이지 (예약 내역)",
				duration: "3일",
				status: "pending",
			},
		],
	},
	{
		id: "5",
		name: "테스트 및 QA",
		children: [
			{
				id: "5.1",
				name: "단위 테스트 작성",
				duration: "3일",
				status: "pending",
			},
			{ id: "5.2", name: "통합 테스트", duration: "2일", status: "pending" },
			{
				id: "5.3",
				name: "UAT (사용자 수용 테스트)",
				duration: "3일",
				status: "pending",
			},
		],
	},
	{
		id: "6",
		name: "배포 및 운영",
		children: [
			{
				id: "6.1",
				name: "스테이징 환경 배포",
				duration: "1일",
				status: "pending",
			},
			{ id: "6.2", name: "프로덕션 배포", duration: "1일", status: "pending" },
			{
				id: "6.3",
				name: "모니터링/로깅 설정",
				duration: "1일",
				status: "pending",
			},
		],
	},
];

function getStatusColor(status: string) {
	switch (status) {
		case "completed":
			return "success";
		case "in-progress":
			return "warning";
		default:
			return "default";
	}
}

function getStatusLabel(status: string) {
	switch (status) {
		case "completed":
			return "완료";
		case "in-progress":
			return "진행중";
		default:
			return "예정";
	}
}

export function WBSClient() {
	return (
		<div className="min-h-screen bg-black p-8">
			{/* 배경 효과 */}
			<div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
			<div className="fixed top-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-70" />

			<div className="relative z-10 max-w-7xl mx-auto">
				{/* 헤더 */}
				<div className="mb-8">
					<h1 className="text-3xl font-bold mb-2">
						<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
							예약 서비스
						</span>{" "}
						WBS
					</h1>
					<p className="text-default-600">
						Work Breakdown Structure - 프로젝트 작업 분해 구조
					</p>
				</div>

				{/* 탭 영역 */}
				<Tabs
					aria-label="WBS 뷰"
					color="primary"
					variant="underlined"
					classNames={{
						tabList: "gap-6",
						tab: "px-0 h-12",
					}}
				>
					<Tab key="overview" title="전체 구조">
						<Card className="bg-content1 shadow-sm rounded-xl mt-4">
							<CardHeader>
								<h2 className="text-xl font-semibold">프로젝트 전체 WBS</h2>
							</CardHeader>
							<Divider />
							<CardBody>
								<MermaidChart chart={wbsMainChart} className="min-h-[500px]" />
							</CardBody>
						</Card>
					</Tab>

					<Tab key="backend" title="백엔드 상세">
						<Card className="bg-content1 shadow-sm rounded-xl mt-4">
							<CardHeader>
								<h2 className="text-xl font-semibold">백엔드 개발 WBS</h2>
							</CardHeader>
							<Divider />
							<CardBody>
								<MermaidChart
									chart={wbsBackendChart}
									className="min-h-[400px]"
								/>
							</CardBody>
						</Card>
					</Tab>

					<Tab key="frontend" title="프론트엔드 상세">
						<Card className="bg-content1 shadow-sm rounded-xl mt-4">
							<CardHeader>
								<h2 className="text-xl font-semibold">프론트엔드 개발 WBS</h2>
							</CardHeader>
							<Divider />
							<CardBody>
								<MermaidChart
									chart={wbsFrontendChart}
									className="min-h-[400px]"
								/>
							</CardBody>
						</Card>
					</Tab>

					<Tab key="list" title="작업 목록">
						<div className="mt-4 space-y-4">
							{wbsData.map((phase) => (
								<Card
									key={phase.id}
									className="bg-content1 shadow-sm rounded-xl"
								>
									<CardHeader>
										<h3 className="text-lg font-semibold">
											{phase.id}. {phase.name}
										</h3>
									</CardHeader>
									<Divider />
									<CardBody>
										<div className="space-y-3">
											{phase.children.map((task) => (
												<div
													key={task.id}
													className="flex items-center justify-between p-3 bg-content2 rounded-lg"
												>
													<div className="flex items-center gap-3">
														<span className="text-default-500 font-mono text-sm">
															{task.id}
														</span>
														<span>{task.name}</span>
													</div>
													<div className="flex items-center gap-3">
														<span className="text-default-500 text-sm">
															{task.duration}
														</span>
														<Chip
															size="sm"
															color={getStatusColor(task.status)}
															variant="flat"
														>
															{getStatusLabel(task.status)}
														</Chip>
													</div>
												</div>
											))}
										</div>
									</CardBody>
								</Card>
							))}
						</div>
					</Tab>
				</Tabs>

				{/* 요약 카드 */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
					<Card className="bg-content1 shadow-sm rounded-xl">
						<CardBody className="text-center py-6">
							<p className="text-3xl font-bold text-primary">6</p>
							<p className="text-default-600 text-sm">주요 단계</p>
						</CardBody>
					</Card>
					<Card className="bg-content1 shadow-sm rounded-xl">
						<CardBody className="text-center py-6">
							<p className="text-3xl font-bold text-success">2</p>
							<p className="text-default-600 text-sm">완료</p>
						</CardBody>
					</Card>
					<Card className="bg-content1 shadow-sm rounded-xl">
						<CardBody className="text-center py-6">
							<p className="text-3xl font-bold text-warning">1</p>
							<p className="text-default-600 text-sm">진행중</p>
						</CardBody>
					</Card>
					<Card className="bg-content1 shadow-sm rounded-xl">
						<CardBody className="text-center py-6">
							<p className="text-3xl font-bold text-default-400">17</p>
							<p className="text-default-600 text-sm">예정</p>
						</CardBody>
					</Card>
				</div>
			</div>
		</div>
	);
}
