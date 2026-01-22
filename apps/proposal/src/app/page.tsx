"use client";

import { observer } from "mobx-react-lite";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
	Tab,
	Tabs,
} from "@heroui/react";
import {
	ArrowRight,
	Brain,
	Calendar,
	CheckCircle,
	Cloud,
	Code2,
	Database,
	FileText,
	GitBranch,
	Home,
	Layers,
	LayoutDashboard,
	Lightbulb,
	ListTree,
	Rocket,
	Server,
	Shield,
	Target,
	Users,
	Zap,
} from "lucide-react";
import type { Key } from "react";
import { useState } from "react";

const ProposalPage = observer(() => {
	const [selectedTab, setSelectedTab] = useState<Key>("intro");

	const handleTabChange = (key: Key) => {
		setSelectedTab(key);
	};

	return (
		<div className="relative min-h-screen">
			{/* 배경 블러 오브 */}
			<div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/30 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />
			<div className="fixed top-0 right-0 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 opacity-70 pointer-events-none" />

			{/* 헤더 */}
			<header className="border-b border-divider bg-background/60 backdrop-blur-md sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-6 py-4">
					<div className="flex items-center gap-3">
						<Brain className="w-8 h-8 text-primary" />
						<div>
							<h1 className="text-xl font-bold">
								<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
									AI 주도 기획
								</span>
							</h1>
							<p className="text-xs text-default-500">
								Proposal & Planning Dashboard
							</p>
						</div>
					</div>
				</div>
			</header>

			{/* 메인 컨텐츠 */}
			<main className="max-w-7xl mx-auto px-6 py-8">
				<Tabs
					aria-label="기획 메뉴"
					selectedKey={selectedTab as string}
					onSelectionChange={handleTabChange}
					color="primary"
					variant="underlined"
					classNames={{
						tabList:
							"gap-6 w-full relative rounded-none p-0 border-b border-divider",
						cursor: "w-full bg-primary",
						tab: "max-w-fit px-0 h-12",
						tabContent: "group-data-[selected=true]:text-primary",
					}}
				>
					<Tab
						key="intro"
						title={
							<div className="flex items-center gap-2">
								<Home className="w-4 h-4" />
								<span>소개</span>
							</div>
						}
					>
						<IntroPanel />
					</Tab>
					<Tab
						key="dashboard"
						title={
							<div className="flex items-center gap-2">
								<LayoutDashboard className="w-4 h-4" />
								<span>대시보드</span>
							</div>
						}
					>
						<DashboardPanel />
					</Tab>
					<Tab
						key="wbs"
						title={
							<div className="flex items-center gap-2">
								<ListTree className="w-4 h-4" />
								<span>WBS</span>
							</div>
						}
					>
						<WBSPanel />
					</Tab>
					<Tab
						key="requirements"
						title={
							<div className="flex items-center gap-2">
								<FileText className="w-4 h-4" />
								<span>요구사항</span>
							</div>
						}
					>
						<RequirementsPanel />
					</Tab>
					<Tab
						key="screens"
						title={
							<div className="flex items-center gap-2">
								<Target className="w-4 h-4" />
								<span>화면 설계</span>
							</div>
						}
					>
						<ScreensPanel />
					</Tab>
					<Tab
						key="api"
						title={
							<div className="flex items-center gap-2">
								<Server className="w-4 h-4" />
								<span>API 설계</span>
							</div>
						}
					>
						<APIPanel />
					</Tab>
					<Tab
						key="database"
						title={
							<div className="flex items-center gap-2">
								<Database className="w-4 h-4" />
								<span>DB 설계</span>
							</div>
						}
					>
						<DatabasePanel />
					</Tab>
					<Tab
						key="milestones"
						title={
							<div className="flex items-center gap-2">
								<GitBranch className="w-4 h-4" />
								<span>마일스톤</span>
							</div>
						}
					>
						<MilestonesPanel />
					</Tab>
					<Tab
						key="schedule"
						title={
							<div className="flex items-center gap-2">
								<Calendar className="w-4 h-4" />
								<span>일정</span>
							</div>
						}
					>
						<SchedulePanel />
					</Tab>
				</Tabs>
			</main>
		</div>
	);
});

export default ProposalPage;

/** 소개 패널 (랜딩 페이지) */
function IntroPanel() {
	return (
		<div className="py-8 space-y-16">
			{/* Hero 섹션 */}
			<HeroSection />

			{/* 회사 소개 섹션 */}
			<AboutSection />

			{/* 기술 스택 섹션 */}
			<TechStackSection />

			{/* Footer */}
			<Footer />
		</div>
	);
}

function HeroSection() {
	return (
		<section className="text-center py-16">
			<Chip
				color="primary"
				variant="flat"
				size="lg"
				className="mb-6"
				startContent={<Rocket className="w-4 h-4" />}
			>
				Software Development Partner
			</Chip>

			<h2 className="text-5xl md:text-7xl font-bold mb-6">
				<span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
					제대로 만드는 사람들
				</span>
			</h2>

			<p className="text-xl md:text-2xl text-default-600 mb-8">
				기획부터 배포까지, 빈틈없는 완성도
			</p>

			<p className="text-lg text-default-500 mb-12 max-w-2xl mx-auto">
				검증된 기술 스택과 체계적인 개발 프로세스로
				<br />
				비즈니스 성공을 위한 최적의 솔루션을 제공합니다.
			</p>

			<div className="flex flex-col sm:flex-row gap-4 justify-center">
				<Button
					color="primary"
					size="lg"
					endContent={<ArrowRight className="w-5 h-5" />}
					className="font-semibold"
				>
					프로젝트 문의하기
				</Button>
				<Button
					variant="bordered"
					size="lg"
					className="font-semibold border-default-300"
				>
					포트폴리오 보기
				</Button>
			</div>
		</section>
	);
}

function AboutSection() {
	const values = [
		{
			icon: <Target className="w-8 h-8" />,
			title: "명확한 목표 설정",
			description:
				"프로젝트 시작 전 비즈니스 목표와 기술 요구사항을 명확히 정의하여 방향성을 확립합니다.",
		},
		{
			icon: <Shield className="w-8 h-8" />,
			title: "안정적인 품질",
			description:
				"코드 리뷰, 자동화 테스트, CI/CD 파이프라인으로 일관된 품질을 보장합니다.",
		},
		{
			icon: <Zap className="w-8 h-8" />,
			title: "빠른 실행력",
			description:
				"애자일 방법론과 최신 개발 도구로 빠르고 유연하게 대응합니다.",
		},
		{
			icon: <Users className="w-8 h-8" />,
			title: "긴밀한 소통",
			description:
				"투명한 진행 상황 공유와 정기적인 미팅으로 신뢰를 구축합니다.",
		},
	];

	return (
		<section>
			<div className="text-center mb-12">
				<Chip color="secondary" variant="flat" className="mb-4">
					About Us
				</Chip>
				<h3 className="text-3xl md:text-4xl font-bold mb-4">
					우리가 일하는 방식
				</h3>
				<p className="text-default-600 text-lg max-w-2xl mx-auto">
					기술적 완성도와 비즈니스 가치, 두 마리 토끼를 모두 잡습니다.
				</p>
			</div>

			<div className="grid md:grid-cols-2 gap-6">
				{values.map((value) => (
					<Card key={value.title} className="bg-content1 shadow-sm">
						<CardBody className="p-6">
							<div className="flex gap-4">
								<div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
									{value.icon}
								</div>
								<div>
									<h4 className="text-xl font-semibold mb-2">{value.title}</h4>
									<p className="text-default-500">{value.description}</p>
								</div>
							</div>
						</CardBody>
					</Card>
				))}
			</div>

			{/* 비전 카드 */}
			<Card className="mt-12 bg-gradient-to-r from-primary/10 to-secondary/10 border border-divider">
				<CardBody className="p-8 text-center">
					<Lightbulb className="w-12 h-12 mx-auto mb-4 text-primary" />
					<h4 className="text-2xl font-bold mb-4">Our Vision</h4>
					<p className="text-lg text-default-600 max-w-3xl mx-auto">
						&ldquo;완벽한 코드보다 완벽한 솔루션을 추구합니다.&rdquo;
						<br />
						<span className="text-default-500 text-base mt-2 block">
							기술은 도구일 뿐, 진정한 가치는 고객의 비즈니스 성공에 있습니다.
						</span>
					</p>
				</CardBody>
			</Card>
		</section>
	);
}

function TechStackSection() {
	const techStacks = [
		{
			category: "Frontend",
			icon: <Code2 className="w-6 h-6" />,
			color: "primary" as const,
			techs: [
				{ name: "Next.js", description: "React 기반 풀스택 프레임워크" },
				{ name: "React", description: "컴포넌트 기반 UI 라이브러리" },
				{ name: "TypeScript", description: "타입 안전성 확보" },
				{ name: "Tailwind CSS", description: "유틸리티 기반 스타일링" },
			],
		},
		{
			category: "Backend",
			icon: <Server className="w-6 h-6" />,
			color: "secondary" as const,
			techs: [
				{ name: "NestJS", description: "엔터프라이즈급 Node.js 프레임워크" },
				{ name: "Prisma", description: "타입 안전 ORM" },
				{ name: "PostgreSQL", description: "관계형 데이터베이스" },
				{ name: "Redis", description: "캐싱 및 세션 관리" },
			],
		},
		{
			category: "Infrastructure",
			icon: <Cloud className="w-6 h-6" />,
			color: "success" as const,
			techs: [
				{ name: "Docker", description: "컨테이너화" },
				{ name: "Kubernetes", description: "컨테이너 오케스트레이션" },
				{ name: "AWS", description: "클라우드 인프라" },
				{ name: "Vercel", description: "프론트엔드 배포 플랫폼" },
			],
		},
		{
			category: "DevOps",
			icon: <GitBranch className="w-6 h-6" />,
			color: "warning" as const,
			techs: [
				{ name: "Jenkins", description: "CI/CD 파이프라인" },
				{ name: "GitHub Actions", description: "자동화 워크플로우" },
				{ name: "Turborepo", description: "모노레포 빌드 시스템" },
				{ name: "Biome", description: "린트 및 포맷팅" },
			],
		},
	];

	return (
		<section className="py-8 px-6 -mx-6 bg-content1/30 rounded-xl">
			<div className="text-center mb-12">
				<Chip color="primary" variant="flat" className="mb-4">
					Tech Stack
				</Chip>
				<h3 className="text-3xl md:text-4xl font-bold mb-4">검증된 기술 스택</h3>
				<p className="text-default-600 text-lg max-w-2xl mx-auto">
					최신 기술과 안정성을 동시에 확보한 기술 스택으로 프로젝트를 진행합니다.
				</p>
			</div>

			<div className="grid md:grid-cols-2 gap-6">
				{techStacks.map((stack) => (
					<Card key={stack.category} className="bg-content1 shadow-sm h-full">
						<CardBody className="p-6">
							<div className="flex items-center gap-3 mb-4">
								<div
									className={`w-10 h-10 rounded-lg bg-${stack.color}/10 flex items-center justify-center text-${stack.color}`}
								>
									{stack.icon}
								</div>
								<h4 className="text-xl font-semibold">{stack.category}</h4>
							</div>
							<Divider className="mb-4" />
							<div className="space-y-3">
								{stack.techs.map((tech) => (
									<div key={tech.name} className="flex items-start gap-2">
										<CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
										<div>
											<span className="font-medium">{tech.name}</span>
											<span className="text-default-500 text-sm ml-2">
												- {tech.description}
											</span>
										</div>
									</div>
								))}
							</div>
						</CardBody>
					</Card>
				))}
			</div>

			{/* 개발 프로세스 */}
			<Card className="mt-12 bg-content1 shadow-sm">
				<CardBody className="p-8">
					<div className="flex items-center gap-3 mb-6">
						<Layers className="w-8 h-8 text-primary" />
						<h4 className="text-2xl font-bold">개발 프로세스</h4>
					</div>
					<div className="grid md:grid-cols-5 gap-4">
						{[
							{ step: "01", title: "요구사항 분석", desc: "비즈니스 이해" },
							{ step: "02", title: "설계", desc: "아키텍처 설계" },
							{ step: "03", title: "개발", desc: "애자일 스프린트" },
							{ step: "04", title: "테스트", desc: "품질 검증" },
							{ step: "05", title: "배포", desc: "안정적 릴리스" },
						].map((process, index) => (
							<div key={process.step} className="text-center">
								<div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
									<span className="text-primary font-bold">{process.step}</span>
								</div>
								<h5 className="font-semibold mb-1">{process.title}</h5>
								<p className="text-default-500 text-sm">{process.desc}</p>
								{index < 4 && (
									<ArrowRight className="w-5 h-5 text-default-300 mx-auto mt-3 hidden md:block" />
								)}
							</div>
						))}
					</div>
				</CardBody>
			</Card>
		</section>
	);
}

function Footer() {
	return (
		<footer className="py-8 border-t border-divider">
			<div className="flex flex-col md:flex-row justify-between items-center gap-4">
				<div className="text-center md:text-left">
					<h4 className="text-xl font-bold mb-1">
						<span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
							제대로 만드는 사람들
						</span>
					</h4>
					<p className="text-default-500 text-sm">
						기획부터 배포까지, 빈틈없는 완성도
					</p>
				</div>
				<div className="text-center md:text-right">
					<p className="text-default-500 text-sm">
						&copy; 2025 제대로 만드는 사람들. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}

/** 대시보드 패널 */
function DashboardPanel() {
	return (
		<div className="py-8">
			<EmptyState
				title="대시보드"
				description="프로젝트 전체 현황을 한눈에 볼 수 있습니다."
			/>
		</div>
	);
}

/** WBS 패널 */
function WBSPanel() {
	return (
		<div className="py-8">
			<EmptyState
				title="WBS (Work Breakdown Structure)"
				description="작업 분해 구조를 정의하고 관리합니다."
			/>
		</div>
	);
}

/** 요구사항 패널 */
function RequirementsPanel() {
	return (
		<div className="py-8">
			<EmptyState
				title="요구사항 정의서"
				description="기능/비기능 요구사항을 정의하고 추적합니다."
			/>
		</div>
	);
}

/** 화면 설계 패널 */
function ScreensPanel() {
	return (
		<div className="py-8">
			<EmptyState
				title="화면 설계서"
				description="와이어프레임 및 화면 흐름을 설계합니다."
			/>
		</div>
	);
}

/** API 설계 패널 */
function APIPanel() {
	return (
		<div className="py-8">
			<EmptyState
				title="API 설계서"
				description="REST API 엔드포인트를 설계하고 문서화합니다."
			/>
		</div>
	);
}

/** DB 설계 패널 */
function DatabasePanel() {
	return (
		<div className="py-8">
			<EmptyState
				title="DB 설계서"
				description="데이터베이스 스키마와 ERD를 설계합니다."
			/>
		</div>
	);
}

/** 마일스톤 패널 */
function MilestonesPanel() {
	return (
		<div className="py-8">
			<EmptyState
				title="마일스톤"
				description="프로젝트 주요 이정표를 관리합니다."
			/>
		</div>
	);
}

/** 일정 패널 */
function SchedulePanel() {
	return (
		<div className="py-8">
			<EmptyState
				title="프로젝트 일정"
				description="간트 차트 형태로 일정을 관리합니다."
			/>
		</div>
	);
}

/** 빈 상태 컴포넌트 */
function EmptyState({
	title,
	description,
}: {
	title: string;
	description: string;
}) {
	return (
		<Card className="bg-content1/50 border border-divider">
			<CardHeader className="pb-0">
				<h2 className="text-2xl font-bold">{title}</h2>
			</CardHeader>
			<CardBody>
				<div className="flex flex-col items-center justify-center py-16 text-center">
					<div className="w-16 h-16 rounded-full bg-default-100 flex items-center justify-center mb-4">
						<Chip color="default" variant="flat" size="sm">
							준비 중
						</Chip>
					</div>
					<p className="text-default-500 mb-2">{description}</p>
					<p className="text-default-400 text-sm">
						이 영역은 기능 구현 전 빈 상태입니다.
					</p>
				</div>
			</CardBody>
		</Card>
	);
}
