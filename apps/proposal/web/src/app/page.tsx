"use client";

import {
	Button,
	Chip,
	Container,
	HStack,
	Separator,
	Typography,
	useDesignSystemTheme,
	VStack,
} from "@cocrepo/ui";
import { Card } from "@heroui/react";
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
	Moon,
	Palette,
	RefreshCcw,
	Rocket,
	ShieldCheck,
	Sparkles,
	Sun,
	TimerReset,
	Workflow,
	Wrench,
} from "lucide-react";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import {
	type ProposalCareerEntry,
	type ProposalIconKey,
	type ProposalMetric,
	type ProposalNarrativeCard,
	type ProposalPageData,
	type ProposalPortfolioItem,
	type ProposalProcessStep,
	type ProposalResumeFact,
	type ProposalStackGroup,
	proposalPageData,
	type SectionId,
} from "./proposal-page-data";

interface SectionHeadingProps {
	eyebrow: string;
	title: string;
	description: string;
}

interface LandingSectionProps extends SectionHeadingProps {
	id: SectionId;
	children: React.ReactNode;
}

type ThemeMode = "light" | "dark";

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

const SECTION_TITLE_CLASS = "font-display md:text-5xl";
const SECTION_DESCRIPTION_CLASS = "mt-5 md:text-lg";
const SURFACE_CARD_CLASS = "h-full border border-border bg-surface";
const NAVIGATION_BUTTON_CLASS =
	"border border-border bg-surface text-foreground transition-colors hover:bg-surface-hover";
const STRONG_TEXT_CLASS = "text-foreground";
const PANEL_DIVIDER_CLASS = "border-border";
const PANEL_ICON_CLASS =
	"flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent-soft-foreground";

const ICONS: Record<ProposalIconKey, LucideIcon> = {
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
	career: () => scrollToSection("career"),
};

function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
	return (
		<div className="max-w-4xl">
			<HStack alignItems="center" gap="section" className="mb-5">
				<span className="h-px w-12 bg-separator" />
				<Typography
					type="body-xs"
					weight="semibold"
					className="text-accent uppercase tracking-[0.32em]"
				>
					{eyebrow}
				</Typography>
			</HStack>
			<Typography.Heading level={2} className={SECTION_TITLE_CLASS}>
				{title}
			</Typography.Heading>
			<Typography.Paragraph color="muted" className={SECTION_DESCRIPTION_CLASS}>
				{description}
			</Typography.Paragraph>
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
			<div className="flex flex-col gap-12 md:gap-16">
				<SectionHeading
					eyebrow={eyebrow}
					title={title}
					description={description}
				/>
				{children}
			</div>
		</motion.section>
	);
}

function renderNavigationButton(item: ProposalPageData["navigation"][number]) {
	return (
		<Button
			key={item.id}
			size="sm"
			variant="secondary"
			onPress={SECTION_ACTIONS[item.id]}
			className={NAVIGATION_BUTTON_CLASS}
		>
			{item.label}
		</Button>
	);
}

function ThemeToggle({
	theme,
	isThemeReady,
	onToggleTheme,
}: {
	theme: ThemeMode;
	isThemeReady: boolean;
	onToggleTheme: () => void;
}) {
	const Icon = theme === "dark" ? Sun : Moon;
	const label = theme === "dark" ? "Light" : "Dark";

	return (
		<Button
			size="sm"
			variant="secondary"
			onPress={onToggleTheme}
			aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
			className="border border-border bg-surface px-3 text-foreground transition-colors hover:bg-surface-hover"
			startContent={
				isThemeReady ? (
					<Icon className="h-4 w-4" />
				) : (
					<span className="h-4 w-4 rounded-full bg-foreground/20" />
				)
			}
		>
			{isThemeReady ? label : "Theme"}
		</Button>
	);
}

function renderMetricCard(item: ProposalMetric) {
	return (
		<motion.div key={item.label} variants={ITEM_VARIANTS}>
			<Card className={SURFACE_CARD_CLASS}>
				<Card.Content className="gap-4 p-6 md:p-7">
					<Typography.Paragraph size="sm" weight="semibold">
						{item.label}
					</Typography.Paragraph>
					<Typography.Paragraph size="sm" color="muted">
						{item.description}
					</Typography.Paragraph>
				</Card.Content>
			</Card>
		</motion.div>
	);
}

function renderNarrativeCard(item: ProposalNarrativeCard) {
	const Icon = ICONS[item.iconKey];

	return (
		<motion.div key={item.title} variants={ITEM_VARIANTS}>
			<Card className={SURFACE_CARD_CLASS}>
				<Card.Header className="items-start gap-4 pb-0">
					<div className={PANEL_ICON_CLASS}>
						<Icon className="h-5 w-5" />
					</div>
					<VStack gap="dense">
						<Typography.Heading level={5}>{item.title}</Typography.Heading>
					</VStack>
				</Card.Header>
				<Card.Content className="pt-4">
					<Typography.Paragraph size="sm" color="muted">
						{item.description}
					</Typography.Paragraph>
				</Card.Content>
			</Card>
		</motion.div>
	);
}

function renderProcessOutput(output: string) {
	return (
		<li key={output}>
			<HStack alignItems="start" gap="block">
				<BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
				<Typography type="body-sm" color="muted">
					{output}
				</Typography>
			</HStack>
		</li>
	);
}

function renderProcessCard(step: ProposalProcessStep) {
	const Icon = ICONS[step.iconKey];

	return (
		<motion.div key={step.step} variants={ITEM_VARIANTS}>
			<Card className={SURFACE_CARD_CLASS}>
				<Card.Header className="items-start justify-between gap-4">
					<VStack gap="block">
						<Chip
							variant="soft"
							color="accent"
							className="text-[11px] uppercase tracking-[0.24em]"
						>
							Step {step.step}
						</Chip>
						<Typography.Heading level={5}>{step.title}</Typography.Heading>
					</VStack>
					<div className={PANEL_ICON_CLASS}>
						<Icon className="h-5 w-5" />
					</div>
				</Card.Header>
				<Card.Content className="gap-6">
					<Typography.Paragraph size="sm" color="muted">
						{step.description}
					</Typography.Paragraph>
					<ul className="flex flex-col gap-2">
						{step.outputs.map(renderProcessOutput)}
					</ul>
				</Card.Content>
			</Card>
		</motion.div>
	);
}

function renderCostLine(item: string) {
	return (
		<li key={item}>
			<HStack alignItems="start" gap="block">
				<BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-accent" />
				<Typography type="body-sm" color="muted">
					{item}
				</Typography>
			</HStack>
		</li>
	);
}

function renderCareerLine(item: string) {
	return (
		<li key={item}>
			<HStack alignItems="start" gap="block">
				<BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-accent" />
				<Typography type="body-sm" color="muted">
					{item}
				</Typography>
			</HStack>
		</li>
	);
}

function renderResumeFactCard(item: ProposalResumeFact) {
	return (
		<motion.div key={item.label} variants={ITEM_VARIANTS}>
			<Card className={SURFACE_CARD_CLASS}>
				<Card.Content className="gap-3 p-6">
					<Typography.Paragraph
						size="xs"
						weight="semibold"
						className="text-accent uppercase tracking-[0.26em]"
					>
						{item.label}
					</Typography.Paragraph>
					<Typography.Heading level={5}>{item.value}</Typography.Heading>
					<Typography.Paragraph size="sm" color="muted">
						{item.description}
					</Typography.Paragraph>
				</Card.Content>
			</Card>
		</motion.div>
	);
}

function renderToolChip(tool: string) {
	return (
		<Chip key={tool} variant="soft" color="default">
			{tool}
		</Chip>
	);
}

function renderCareerCard(entry: ProposalCareerEntry) {
	const Icon = ICONS[entry.iconKey];

	return (
		<motion.div
			key={`${entry.organization}-${entry.period}`}
			variants={ITEM_VARIANTS}
		>
			<Card className={SURFACE_CARD_CLASS}>
				<Card.Header
					className={`flex-col items-start gap-5 border-b ${PANEL_DIVIDER_CLASS}`}
				>
					<div className="flex w-full items-start justify-between gap-4">
						<VStack gap="block">
							<Chip variant="soft" color="default">
								{entry.period}
							</Chip>
							<VStack gap="inline">
								<Typography.Heading level={5}>
									{entry.organization}
								</Typography.Heading>
								<Typography.Paragraph
									size="sm"
									weight="semibold"
									className="text-accent"
								>
									{entry.role}
								</Typography.Paragraph>
								<Typography.Paragraph size="sm" color="muted">
									{entry.headline}
								</Typography.Paragraph>
							</VStack>
						</VStack>
						<div className={PANEL_ICON_CLASS}>
							<Icon className="h-5 w-5" />
						</div>
					</div>
				</Card.Header>
				<Card.Content className="gap-6 p-6 md:p-7">
					<Typography.Paragraph size="sm" color="muted">
						{entry.description}
					</Typography.Paragraph>
					<ul className="flex flex-col gap-3">
						{entry.highlights.map(renderCareerLine)}
					</ul>
					<HStack gap="inline" className="flex-wrap">
						{entry.tools.map(renderToolChip)}
					</HStack>
				</Card.Content>
			</Card>
		</motion.div>
	);
}

function renderPortfolioCard(item: ProposalPortfolioItem) {
	const Icon = ICONS[item.iconKey];

	return (
		<motion.div key={item.title} variants={ITEM_VARIANTS}>
			<Card className={SURFACE_CARD_CLASS}>
				<Card.Header className="items-start gap-4 pb-0">
					<div className={PANEL_ICON_CLASS}>
						<Icon className="h-5 w-5" />
					</div>
					<VStack gap="inline">
						<Typography.Heading level={5}>{item.title}</Typography.Heading>
						<Typography.Paragraph size="sm" color="muted">
							{item.description}
						</Typography.Paragraph>
					</VStack>
				</Card.Header>
				<Card.Content className="gap-5 pt-5">
					<ul className="flex flex-col gap-3">
						{item.highlights.map(renderCareerLine)}
					</ul>
					<HStack gap="inline" className="flex-wrap">
						{item.tools.map(renderToolChip)}
					</HStack>
				</Card.Content>
			</Card>
		</motion.div>
	);
}

function renderStackCard(group: ProposalStackGroup) {
	return (
		<motion.div key={group.title} variants={ITEM_VARIANTS}>
			<Card className={SURFACE_CARD_CLASS}>
				<Card.Header className="flex-col items-start gap-3">
					<Chip variant="soft" color="default">
						{group.title}
					</Chip>
					<VStack gap="inline">
						<Typography.Heading level={5}>{group.title}</Typography.Heading>
						<Typography.Paragraph size="sm" color="muted">
							{group.description}
						</Typography.Paragraph>
					</VStack>
				</Card.Header>
				<Card.Content className="flex-row flex-wrap gap-2 pt-0">
					{group.tools.map(renderToolChip)}
				</Card.Content>
			</Card>
		</motion.div>
	);
}

function renderClosingBullet(bullet: string) {
	return (
		<li key={bullet}>
			<HStack alignItems="center" gap="block" className={STRONG_TEXT_CLASS}>
				<BadgeCheck className="h-4 w-4 text-accent" />
				<Typography type="body-sm" weight="medium">
					{bullet}
				</Typography>
			</HStack>
		</li>
	);
}

function TopNavigation({
	navigation,
	theme,
	isThemeReady,
	onToggleTheme,
}: {
	navigation: ProposalPageData["navigation"];
	theme: ThemeMode;
	isThemeReady: boolean;
	onToggleTheme: () => void;
}) {
	return (
		<div className="mx-auto w-full max-w-[90rem] px-5 pt-5 md:px-8 md:pt-8">
			<div className="sticky top-4 z-40 rounded-3xl border border-border bg-surface px-5 py-5 shadow-surface md:px-8">
				<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
					<HStack alignItems="center" gap="inline">
						<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent font-display text-lg font-semibold text-accent-foreground">
							O
						</div>
						<div>
							<Typography.Heading level={5} className="font-display">
								온짓다
							</Typography.Heading>
							<Typography.Paragraph
								size="xs"
								color="muted"
								className="uppercase tracking-[0.22em]"
							>
								AI-centered delivery studio
							</Typography.Paragraph>
						</div>
					</HStack>
					<div className="flex flex-col gap-4 md:items-end">
						<HStack gap="block" className="flex-wrap">
							{navigation.map(renderNavigationButton)}
						</HStack>
						<ThemeToggle
							theme={theme}
							isThemeReady={isThemeReady}
							onToggleTheme={onToggleTheme}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

function HeroSection({
	hero,
	process,
}: Pick<ProposalPageData, "hero" | "process">) {
	const primaryAction = SECTION_ACTIONS[hero.primaryAction.target];
	const secondaryAction = SECTION_ACTIONS[hero.secondaryAction.target];
	const previewSteps = process.slice(0, 3);

	return (
		<motion.section
			initial="hidden"
			animate="show"
			variants={SECTION_VARIANTS}
			className="grid gap-14 md:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] md:items-start md:gap-16"
		>
			<VStack className="gap-12">
				<Chip
					variant="soft"
					color="accent"
					className="px-3 py-5 text-[11px] font-semibold tracking-[0.32em]"
				>
					{hero.eyebrow}
				</Chip>
				<VStack gap="roomy">
					<Typography.Heading
						level={1}
						className="font-display max-w-5xl text-5xl leading-none md:text-7xl"
					>
						{hero.title}
					</Typography.Heading>
					<Typography.Paragraph color="muted" className="max-w-3xl md:text-lg">
						{hero.description}
					</Typography.Paragraph>
				</VStack>
				<HStack gap="section" className="flex-wrap">
					<Button
						size="lg"
						variant="primary"
						endContent={<ArrowRight className="h-4 w-4" />}
						onPress={primaryAction}
					>
						{hero.primaryAction.label}
					</Button>
					<Button
						size="lg"
						variant="secondary"
						onPress={secondaryAction}
						className="border border-border bg-surface px-6 text-foreground transition-colors hover:bg-surface-hover"
					>
						{hero.secondaryAction.label}
					</Button>
				</HStack>
				<Separator className="bg-separator" />
				<motion.div
					className="grid gap-6 md:grid-cols-4"
					initial="hidden"
					animate="show"
					variants={GRID_VARIANTS}
				>
					{hero.metrics.map(renderMetricCard)}
				</motion.div>
			</VStack>
			<motion.div initial="hidden" animate="show" variants={GRID_VARIANTS}>
				<Card className="overflow-hidden border border-border bg-surface">
					<Card.Header className="flex-col items-start gap-3 border-b border-border bg-surface-secondary">
						<Chip variant="soft" color="default">
							Execution board
						</Chip>
						<VStack gap="inline">
							<Typography.Heading level={3} className="font-display">
								기획에서 코드까지 같은 리듬으로 움직입니다
							</Typography.Heading>
							<Typography.Paragraph size="sm" color="muted">
								화면, 스펙, 구현이 서로를 기다리지 않도록 실행 레이어를 촘촘하게
								맞춥니다.
							</Typography.Paragraph>
						</VStack>
					</Card.Header>
					<Card.Content className="gap-6 p-6 md:p-8">
						{previewSteps.map(renderProcessCard)}
					</Card.Content>
				</Card>
			</motion.div>
		</motion.section>
	);
}

export default observer(function ProposalPage() {
	const pageData = proposalPageData;
	const { resolvedTheme, toggleTheme } = useDesignSystemTheme();
	const [isThemeReady, setIsThemeReady] = useState(false);
	const theme = isThemeReady ? resolvedTheme : "light";

	useEffect(() => {
		setIsThemeReady(true);
	}, []);

	const onClickThemeToggleButton = () => {
		toggleTheme();
		setIsThemeReady(true);
	};

	return (
		<div className="min-h-screen">
			<TopNavigation
				navigation={pageData.navigation}
				theme={theme}
				isThemeReady={isThemeReady}
				onToggleTheme={onClickThemeToggleButton}
			/>
			<main className="mx-auto w-full max-w-[90rem] px-5 pb-20 pt-8 md:px-8 md:pb-28 md:pt-10">
				<div className="rounded-3xl border border-border bg-surface px-6 py-10 shadow-surface md:px-14 md:py-14">
					<Container width="page" className="py-8 md:py-12">
						<VStack gap="roomy" className="md:gap-32">
							<HeroSection hero={pageData.hero} process={pageData.process} />
							<LandingSection
								id="problem"
								eyebrow="Why this model"
								title="외주 업계의 현실은 수주와 제작 사이의 간극, 그리고 중간 계층의 병목입니다"
								description="겉으로는 고급 인력이 제안을 이끌지만, 실제 제작이 저연차 체인과 중간 전달자 구조로 흘러가면 비용은 비싸고 속도는 느려집니다. 여기에 AI 시대에도 남아 있는 어중간한 기획·디자인·개발 계층이 더해지면 일정은 더 길어집니다."
							>
								<motion.div
									className="grid gap-6 md:grid-cols-3"
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
									className="grid gap-6 md:grid-cols-3"
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
									className="grid gap-6 xl:grid-cols-5"
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
									className="grid gap-6 md:grid-cols-3"
									initial="hidden"
									whileInView="show"
									viewport={VIEWPORT}
									variants={GRID_VARIANTS}
								>
									{pageData.costModel.benefits.map(renderNarrativeCard)}
								</motion.div>
								<div className="grid gap-6 md:grid-cols-2">
									<Card className="border border-danger/30 bg-danger/10 shadow-none">
										<Card.Header className="flex-col items-start gap-3">
											<Chip variant="soft" color="danger">
												줄이는 비용
											</Chip>
											<Typography.Heading level={5}>
												없애도 되는 레이어
											</Typography.Heading>
										</Card.Header>
										<Card.Content>
											<ul className="flex flex-col gap-4">
												{pageData.costModel.removed.map(renderCostLine)}
											</ul>
										</Card.Content>
									</Card>
									<Card className="border border-success/30 bg-success/10 shadow-none">
										<Card.Header className="flex-col items-start gap-3">
											<Chip variant="soft" color="success">
												남겨야 하는 비용
											</Chip>
											<Typography.Heading level={5}>
												사람이 붙잡아야 하는 레이어
											</Typography.Heading>
										</Card.Header>
										<Card.Content>
											<ul className="flex flex-col gap-4">
												{pageData.costModel.focused.map(renderCostLine)}
											</ul>
										</Card.Content>
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
									className="grid gap-6 md:grid-cols-2"
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
									className="grid gap-6 md:grid-cols-2"
									initial="hidden"
									whileInView="show"
									viewport={VIEWPORT}
									variants={GRID_VARIANTS}
								>
									{pageData.projectFits.map(renderNarrativeCard)}
								</motion.div>
								<Card className="border border-border bg-surface">
									<Card.Content className="gap-7 p-6 md:p-9">
										<VStack gap="section">
											<Chip variant="soft" color="accent">
												Closing note
											</Chip>
											<Typography.Heading
												level={3}
												className="font-display md:text-4xl"
											>
												{pageData.closing.title}
											</Typography.Heading>
											<Typography.Paragraph color="muted" className="max-w-3xl">
												{pageData.closing.description}
											</Typography.Paragraph>
										</VStack>
										<ul className="grid gap-4 md:grid-cols-3">
											{pageData.closing.bullets.map(renderClosingBullet)}
										</ul>
									</Card.Content>
								</Card>
							</LandingSection>
							<LandingSection
								id="career"
								eyebrow="Builder background"
								title={pageData.career.title}
								description={pageData.career.description}
							>
								<motion.div
									className="grid gap-6 md:grid-cols-4"
									initial="hidden"
									whileInView="show"
									viewport={VIEWPORT}
									variants={GRID_VARIANTS}
								>
									{pageData.career.summary.map(renderMetricCard)}
								</motion.div>
								<motion.div
									className="grid gap-6 xl:grid-cols-2"
									initial="hidden"
									whileInView="show"
									viewport={VIEWPORT}
									variants={GRID_VARIANTS}
								>
									{pageData.career.entries.map(renderCareerCard)}
								</motion.div>
								<div className="grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
									<motion.div
										className="grid gap-6 sm:grid-cols-2"
										initial="hidden"
										whileInView="show"
										viewport={VIEWPORT}
										variants={GRID_VARIANTS}
									>
										{pageData.career.credentials.map(renderResumeFactCard)}
									</motion.div>
									<Card className="border border-border bg-surface">
										<Card.Header
											className={`flex-col items-start gap-3 border-b ${PANEL_DIVIDER_CLASS}`}
										>
											<Chip variant="soft" color="accent">
												Resume note
											</Chip>
											<VStack gap="inline">
												<Typography.Heading level={5}>
													{pageData.career.statement.title}
												</Typography.Heading>
												<Typography.Paragraph size="sm" color="muted">
													{pageData.career.statement.description}
												</Typography.Paragraph>
											</VStack>
										</Card.Header>
										<Card.Content>
											<ul className="flex flex-col gap-4">
												{pageData.career.statement.bullets.map(renderCareerLine)}
											</ul>
										</Card.Content>
									</Card>
								</div>
								<VStack gap="page">
									<VStack gap="block">
										<Chip variant="soft" color="default">
											Portfolio
										</Chip>
										<Typography.Heading level={3} className="font-display">
											이력서에 포함된 개인 포트폴리오와 학습 프로젝트
										</Typography.Heading>
										<Typography.Paragraph
											size="sm"
											color="muted"
											className="max-w-3xl"
										>
											실서비스에 적용 가능한 구조를 목표로 운영 중인 개인
											프로젝트도 함께 노출합니다. 실무 경력 외에 어떤 방향으로
											역량을 확장하고 있는지도 보이도록 구성했습니다.
										</Typography.Paragraph>
									</VStack>
									<motion.div
										className="grid gap-6 md:grid-cols-2"
										initial="hidden"
										whileInView="show"
										viewport={VIEWPORT}
										variants={GRID_VARIANTS}
									>
										{pageData.career.portfolio.map(renderPortfolioCard)}
									</motion.div>
							</VStack>
						</LandingSection>
					</VStack>
				</Container>
			</div>
		</main>
		</div>
	);
});
