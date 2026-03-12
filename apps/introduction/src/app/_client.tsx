"use client";

import { Container, Page, Section } from "@cocrepo/ui";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Chip,
	Divider,
} from "@heroui/react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
	ArrowRight,
	BadgeCheck,
	Boxes,
	BrainCircuit,
	Coins,
	Database,
	Files,
	GitBranch,
	Layers3,
	LayoutDashboard,
	Palette,
	RefreshCcw,
	Rocket,
	ShieldCheck,
	Sparkles,
	TimerReset,
	Workflow,
	Wrench,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import type {
	IntroductionIconKey,
	IntroductionMetric,
	IntroductionNarrativeCard,
	IntroductionPageData,
	IntroductionProcessStep,
	IntroductionStackGroup,
	SectionId,
} from "./_prefetch";

interface IntroductionPageClientProps {
	pageData: IntroductionPageData;
}

interface SectionHeadingProps {
	eyebrow: string;
	title: string;
	description: string;
}

interface LandingSectionProps extends SectionHeadingProps {
	id: SectionId;
	children: React.ReactNode;
}

const VIEWPORT = { once: true, amount: 0.2 };

const SECTION_VARIANTS = {
	hidden: { opacity: 0, y: 24 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.48,
			ease: "easeOut",
		},
	},
} as const;

const GRID_VARIANTS = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.08,
		},
	},
} as const;

const ITEM_VARIANTS = {
	hidden: { opacity: 0, y: 18 },
	show: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.36,
			ease: "easeOut",
		},
	},
} as const;

const ICONS: Record<IntroductionIconKey, LucideIcon> = {
	workflow: Workflow,
	palette: Palette,
	files: Files,
	brain: BrainCircuit,
	layers: Layers3,
	boxes: Boxes,
	sparkles: Sparkles,
	git: GitBranch,
	wrench: Wrench,
	coins: Coins,
	timer: TimerReset,
	shield: ShieldCheck,
	rocket: Rocket,
	dashboard: LayoutDashboard,
	database: Database,
	refresh: RefreshCcw,
};

function scrollToSection(sectionId: SectionId) {
	if (typeof document === "undefined") {
		return;
	}

	document.getElementById(sectionId)?.scrollIntoView({
		behavior: "smooth",
		block: "start",
	});
}

const SECTION_ACTIONS: Record<SectionId, () => void> = {
	problem: () => scrollToSection("problem"),
	approach: () => scrollToSection("approach"),
	process: () => scrollToSection("process"),
	cost: () => scrollToSection("cost"),
	stack: () => scrollToSection("stack"),
	fit: () => scrollToSection("fit"),
};

function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
	return (
		<div className="max-w-4xl">
			<div className="mb-5 flex items-center gap-4">
				<span className="h-px w-12 bg-gradient-to-r from-primary to-secondary" />
				<span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary-300">
					{eyebrow}
				</span>
			</div>
			<h2 className="font-display text-3xl font-semibold text-white md:text-5xl">
				{title}
			</h2>
			<p className="mt-5 text-base leading-8 text-white/68 md:text-lg md:leading-9">
				{description}
			</p>
		</div>
	);
}

function LandingSection({
	id,
	eyebrow,
	title,
	description,
	children,
}: LandingSectionProps) {
	return (
		<motion.section
			id={id}
			className="scroll-mt-28"
			initial="hidden"
			whileInView="show"
			viewport={VIEWPORT}
			variants={SECTION_VARIANTS}
		>
			<Section className="gap-10 md:gap-14">
				<SectionHeading
					eyebrow={eyebrow}
					title={title}
					description={description}
				/>
				{children}
			</Section>
		</motion.section>
	);
}

function renderNavigationButton(item: IntroductionPageData["navigation"][number]) {
	return (
		<Button
			key={item.id}
			radius="full"
			size="sm"
			variant="flat"
			onPress={SECTION_ACTIONS[item.id]}
			className="border border-white/10 bg-white/6 text-white/72"
		>
			{item.label}
		</Button>
	);
}

function renderMetricCard(item: IntroductionMetric) {
	return (
		<motion.div key={item.label} variants={ITEM_VARIANTS}>
			<Card className="h-full border border-white/10 bg-white/[0.04] shadow-none">
				<CardBody className="gap-4 p-6 md:p-7">
					<p className="text-sm font-semibold text-white">{item.label}</p>
					<p className="text-sm leading-6 text-white/60">{item.description}</p>
				</CardBody>
			</Card>
		</motion.div>
	);
}

function renderNarrativeCard(item: IntroductionNarrativeCard) {
	const Icon = ICONS[item.iconKey];

	return (
		<motion.div key={item.title} variants={ITEM_VARIANTS}>
			<Card className="h-full border border-white/10 bg-content1/70 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
				<CardHeader className="items-start gap-4 pb-0">
					<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/6 text-primary">
						<Icon className="h-5 w-5" />
					</div>
					<div className="space-y-1">
						<h3 className="text-lg font-semibold text-white">{item.title}</h3>
					</div>
				</CardHeader>
				<CardBody className="pt-4 text-sm leading-7 text-white/64">
					{item.description}
				</CardBody>
			</Card>
		</motion.div>
	);
}

function renderProcessOutput(output: string) {
	return (
		<li key={output} className="flex items-start gap-3 text-sm text-white/64">
			<BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
			<span>{output}</span>
		</li>
	);
}

function renderProcessCard(step: IntroductionProcessStep) {
	const Icon = ICONS[step.iconKey];

	return (
		<motion.div key={step.step} variants={ITEM_VARIANTS}>
			<Card className="h-full border border-white/10 bg-white/[0.03] shadow-none">
				<CardHeader className="items-start justify-between gap-4">
					<div className="space-y-3">
						<Chip radius="full" variant="flat" color="primary" className="text-[11px] uppercase tracking-[0.24em]">
							Step {step.step}
						</Chip>
						<h3 className="text-lg font-semibold text-white">{step.title}</h3>
					</div>
					<div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/6 text-secondary">
						<Icon className="h-5 w-5" />
					</div>
				</CardHeader>
				<CardBody className="gap-6 text-sm leading-7 text-white/64">
					<p>{step.description}</p>
					<ul className="space-y-2">
						{step.outputs.map(renderProcessOutput)}
					</ul>
				</CardBody>
			</Card>
		</motion.div>
	);
}

function renderCostLine(item: string) {
	return (
		<li key={item} className="flex items-start gap-3 text-sm leading-7 text-white/64">
			<BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-primary" />
			<span>{item}</span>
		</li>
	);
}

function renderToolChip(tool: string) {
	return (
		<Chip
			key={tool}
			variant="flat"
			radius="full"
			className="border border-white/10 bg-white/[0.04] text-white/78"
		>
			{tool}
		</Chip>
	);
}

function renderStackCard(group: IntroductionStackGroup) {
	return (
		<motion.div key={group.title} variants={ITEM_VARIANTS}>
			<Card className="h-full border border-white/10 bg-content1/70 shadow-none">
				<CardHeader className="flex-col items-start gap-3">
					<Chip radius="full" variant="flat" color="secondary">
						{group.title}
					</Chip>
					<div className="space-y-2">
						<h3 className="text-lg font-semibold text-white">{group.title}</h3>
						<p className="text-sm leading-7 text-white/62">{group.description}</p>
					</div>
				</CardHeader>
				<CardBody className="flex flex-row flex-wrap gap-2 pt-0">
					{group.tools.map(renderToolChip)}
				</CardBody>
			</Card>
		</motion.div>
	);
}

function renderClosingBullet(bullet: string) {
	return (
		<li key={bullet} className="flex items-center gap-3 text-sm font-medium text-white/82">
			<BadgeCheck className="h-4 w-4 text-primary" />
			<span>{bullet}</span>
		</li>
	);
}

function TopNavigation({
	navigation,
}: {
	navigation: IntroductionPageData["navigation"];
}) {
	return (
		<div className="mx-auto w-full max-w-[90rem] px-5 pt-5 md:px-8 md:pt-8">
			<div className="sticky top-4 z-40 rounded-[28px] border border-white/10 bg-black/45 px-5 py-5 backdrop-blur-xl md:px-8">
				<div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary font-display text-lg font-semibold text-black">
							J
						</div>
						<div>
							<p className="font-display text-lg font-semibold text-white">자자</p>
							<p className="text-xs uppercase tracking-[0.22em] text-white/46">
								AI-centered delivery studio
							</p>
						</div>
					</div>
					<div className="flex flex-wrap gap-2">{navigation.map(renderNavigationButton)}</div>
				</div>
			</div>
		</div>
	);
}

function HeroSection({ hero, process }: Pick<IntroductionPageData, "hero" | "process">) {
	const primaryAction = SECTION_ACTIONS[hero.primaryAction.target];
	const secondaryAction = SECTION_ACTIONS[hero.secondaryAction.target];
	const previewSteps = process.slice(0, 3);

	return (
		<motion.section
			initial="hidden"
			animate="show"
			variants={SECTION_VARIANTS}
			className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] md:items-start md:gap-12"
		>
			<div className="space-y-10">
				<Chip radius="full" variant="flat" color="primary" className="border border-primary/20 bg-primary/10 px-3 py-5 text-[11px] font-semibold tracking-[0.32em] text-primary-200">
					{hero.eyebrow}
				</Chip>
				<div className="space-y-6">
					<h1 className="font-display max-w-5xl text-5xl font-semibold leading-none text-white md:text-7xl">
						{hero.title}
					</h1>
					<p className="max-w-3xl text-base leading-8 text-white/70 md:text-lg">
						{hero.description}
					</p>
				</div>
				<div className="flex flex-wrap gap-4">
					<Button
						size="lg"
						radius="full"
						color="primary"
						endContent={<ArrowRight className="h-4 w-4" />}
						onPress={primaryAction}
					>
						{hero.primaryAction.label}
					</Button>
					<Button
						size="lg"
						radius="full"
						variant="flat"
						onPress={secondaryAction}
						className="border border-white/12 bg-white/6 text-white"
					>
						{hero.secondaryAction.label}
					</Button>
				</div>
				<Divider className="bg-white/10" />
				<motion.div
					className="grid gap-5 md:grid-cols-4"
					initial="hidden"
					animate="show"
					variants={GRID_VARIANTS}
				>
					{hero.metrics.map(renderMetricCard)}
				</motion.div>
			</div>
			<motion.div
				initial="hidden"
				animate="show"
				variants={GRID_VARIANTS}
			>
				<Card className="overflow-hidden border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.09),rgba(255,255,255,0.02))] shadow-[0_40px_120px_rgba(0,0,0,0.34)]">
					<CardHeader className="flex-col items-start gap-3 border-b border-white/10 bg-black/18">
						<Chip radius="full" variant="flat" color="secondary">
							Execution board
						</Chip>
						<div className="space-y-2">
							<h2 className="font-display text-2xl font-semibold text-white">
								기획에서 코드까지 같은 리듬으로 움직입니다
							</h2>
							<p className="text-sm leading-7 text-white/62">
								화면, 스펙, 구현이 서로를 기다리지 않도록 실행 레이어를 촘촘하게 맞춥니다.
							</p>
						</div>
					</CardHeader>
						<CardBody className="gap-5 p-6 md:p-7">
						{previewSteps.map(renderProcessCard)}
					</CardBody>
				</Card>
			</motion.div>
		</motion.section>
	);
}

export default observer(function IntroductionPageClient({
	pageData,
}: IntroductionPageClientProps) {
	return (
		<Page top={<TopNavigation navigation={pageData.navigation} />} className="gap-0">
			<main className="relative mx-auto w-full max-w-[90rem] px-5 pb-16 pt-6 md:px-8 md:pb-24 md:pt-8">
				<div className="pointer-events-none fixed bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/25 blur-3xl" />
				<div className="pointer-events-none fixed right-0 top-0 h-[420px] w-[420px] translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/20 blur-3xl opacity-80" />
				<div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-black/42 px-5 py-8 shadow-[0_40px_140px_rgba(0,0,0,0.4)] backdrop-blur-xl md:px-12 md:py-12">
					<Container className="mx-auto max-w-7xl gap-24 py-6 md:gap-32 md:py-10">
						<HeroSection hero={pageData.hero} process={pageData.process} />
						<LandingSection
							id="problem"
							eyebrow="Why this model"
							title="외주 업계의 현실은 수주와 제작 사이의 간극, 그리고 중간 계층의 병목입니다"
							description="겉으로는 고급 인력이 제안을 이끌지만, 실제 제작이 저연차 체인과 중간 전달자 구조로 흘러가면 비용은 비싸고 속도는 느려집니다. 여기에 AI 시대에도 남아 있는 어중간한 기획·디자인·개발 계층이 더해지면 일정은 더 길어집니다."
						>
							<motion.div
								className="grid gap-4 md:grid-cols-3"
								initial="hidden"
								whileInView="show"
								viewport={VIEWPORT}
								variants={GRID_VARIANTS}
							>
								{pageData.problems.map(renderNarrativeCard)}
							</motion.div>
						</LandingSection>
						<LandingSection
							id="approach"
							eyebrow="Approach"
							title="우리는 정적 시안보다 Code to Storybook 흐름을 기준으로 움직입니다"
							description="AI를 장식용 기능으로 보지 않습니다. 기획, 디자인, 개발 초안처럼 이미 빨라진 레이어에는 AI를 적극 투입하고, 기준 자산은 Figma가 아니라 Code로 둡니다. Storybook은 그 Code를 변형과 상태까지 함께 검토하는 공유면입니다. 실제 거래 대상은 AI 개발 플로우 전체입니다."
						>
							<motion.div
								className="grid gap-4 md:grid-cols-3"
								initial="hidden"
								whileInView="show"
								viewport={VIEWPORT}
								variants={GRID_VARIANTS}
							>
								{pageData.approach.map(renderNarrativeCard)}
							</motion.div>
						</LandingSection>
						<LandingSection
							id="process"
							eyebrow="Execution flow"
							title="실행 흐름은 짧게, 산출물은 겹치지 않게 설계합니다"
							description="각 단계는 다음 단계를 기다리기 위한 문서가 아니라, 바로 구현과 검증으로 이어지기 위한 입력입니다. 그래서 같은 예산에서도 더 많은 범위를 다룰 수 있습니다."
						>
							<motion.div
								className="grid gap-4 xl:grid-cols-5"
								initial="hidden"
								whileInView="show"
								viewport={VIEWPORT}
								variants={GRID_VARIANTS}
							>
								{pageData.process.map(renderProcessCard)}
							</motion.div>
						</LandingSection>
						<LandingSection
							id="cost"
							eyebrow="Cost optimization"
							title={pageData.costModel.title}
							description={pageData.costModel.description}
						>
							<motion.div
								className="grid gap-4 md:grid-cols-3"
								initial="hidden"
								whileInView="show"
								viewport={VIEWPORT}
								variants={GRID_VARIANTS}
							>
								{pageData.costModel.benefits.map(renderNarrativeCard)}
							</motion.div>
							<div className="grid gap-4 md:grid-cols-2">
								<Card className="border border-danger/20 bg-danger/5 shadow-none">
									<CardHeader className="flex-col items-start gap-2">
										<Chip radius="full" variant="flat" color="danger">
											줄이는 비용
										</Chip>
										<h3 className="text-xl font-semibold text-white">없애도 되는 레이어</h3>
									</CardHeader>
									<CardBody>
										<ul className="space-y-3">{pageData.costModel.removed.map(renderCostLine)}</ul>
									</CardBody>
								</Card>
								<Card className="border border-success/20 bg-success/5 shadow-none">
									<CardHeader className="flex-col items-start gap-2">
										<Chip radius="full" variant="flat" color="success">
											남겨야 하는 비용
										</Chip>
										<h3 className="text-xl font-semibold text-white">사람이 붙잡아야 하는 레이어</h3>
									</CardHeader>
									<CardBody>
										<ul className="space-y-3">{pageData.costModel.focused.map(renderCostLine)}</ul>
									</CardBody>
								</Card>
							</div>
						</LandingSection>
						<LandingSection
							id="stack"
							eyebrow="Tech credibility"
							title="README에 쌓인 모노레포 기술 자산 위에서 빠르게 전달합니다"
							description="소개용 카피만 만드는 팀이 아니라, 실제로 운영 가능한 제품 구조를 전제로 화면과 서버를 함께 설계합니다. 아래 스택은 현재 저장소에서 사용하는 핵심 기술 축입니다."
						>
							<motion.div
								className="grid gap-4 md:grid-cols-2"
								initial="hidden"
								whileInView="show"
								viewport={VIEWPORT}
								variants={GRID_VARIANTS}
							>
								{pageData.stack.map(renderStackCard)}
							</motion.div>
						</LandingSection>
						<LandingSection
							id="fit"
							eyebrow="Best fit"
							title="이런 프로젝트일수록 AI 중심 방식의 차이가 분명합니다"
							description="복잡한 문서보다 빠른 실행과 운영 가능한 구조가 중요한 팀, 그리고 handoff 비용을 줄이고 싶은 팀에 특히 잘 맞습니다."
						>
							<motion.div
								className="grid gap-4 md:grid-cols-2"
								initial="hidden"
								whileInView="show"
								viewport={VIEWPORT}
								variants={GRID_VARIANTS}
							>
								{pageData.projectFits.map(renderNarrativeCard)}
							</motion.div>
							<Card className="border border-white/10 bg-gradient-to-br from-white/10 via-white/[0.05] to-transparent shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
								<CardBody className="gap-6 p-6 md:p-8">
									<div className="space-y-3">
										<Chip radius="full" variant="flat" color="primary">
											Closing note
										</Chip>
										<h3 className="font-display text-3xl font-semibold text-white md:text-4xl">
											{pageData.closing.title}
										</h3>
										<p className="max-w-3xl text-base leading-8 text-white/68">
											{pageData.closing.description}
										</p>
									</div>
									<ul className="grid gap-3 md:grid-cols-3">{pageData.closing.bullets.map(renderClosingBullet)}</ul>
								</CardBody>
							</Card>
						</LandingSection>
					</Container>
				</div>
			</main>
		</Page>
	);
});
