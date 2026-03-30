"use client";

import { Container } from "@cocrepo/ui";
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

const THEME_STORAGE_KEY = "heroui-theme";
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

const SECTION_TITLE_CLASS =
	"font-display text-3xl font-semibold text-slate-950 md:text-5xl dark:text-white";
const SECTION_DESCRIPTION_CLASS =
	"mt-5 text-base leading-8 text-slate-600 md:text-lg md:leading-9 dark:text-white/68";
const SURFACE_CARD_CLASS =
	"h-full border border-slate-200/80 bg-white/88 shadow-[0_24px_80px_rgba(148,163,184,0.16)] dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none";
const SURFACE_CARD_ELEVATED_CLASS =
	"h-full border border-slate-200/80 bg-white/82 shadow-[0_24px_80px_rgba(148,163,184,0.14)] dark:border-white/10 dark:bg-content1/70 dark:shadow-[0_24px_80px_rgba(0,0,0,0.28)]";
const NAVIGATION_BUTTON_CLASS =
	"border border-slate-200/80 bg-white/80 text-slate-700 shadow-sm transition-colors hover:bg-white dark:border-white/10 dark:bg-white/6 dark:text-white/72 dark:hover:bg-white/10";
const MUTED_TEXT_CLASS = "text-slate-600 dark:text-white/64";
const SOFT_TEXT_CLASS = "text-slate-500 dark:text-white/62";
const STRONG_TEXT_CLASS = "text-slate-700 dark:text-white/82";
const PANEL_DIVIDER_CLASS = "border-slate-200/80 dark:border-white/10";
const PANEL_ICON_CLASS =
	"flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:bg-white/6 dark:text-primary";

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

function resolvePreferredTheme(): ThemeMode {
	if (typeof window === "undefined") {
		return "light";
	}

	const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

	if (storedTheme === "light" || storedTheme === "dark") {
		return storedTheme;
	}

	if (storedTheme === "system") {
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	}

	return window.matchMedia("(prefers-color-scheme: dark)").matches
		? "dark"
		: "light";
}

function applyTheme(theme: ThemeMode) {
	if (typeof document === "undefined") {
		return;
	}

	document.documentElement.classList.remove("light", "dark", "system");
	document.documentElement.classList.add(theme);
	document.documentElement.style.colorScheme = theme;
}

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
			<div className="mb-5 flex items-center gap-4">
				<span className="h-px w-12 bg-gradient-to-r from-primary to-secondary" />
				<span className="text-[11px] font-semibold uppercase tracking-[0.32em] text-primary-700 dark:text-primary-300">
					{eyebrow}
				</span>
			</div>
			<h2 className={SECTION_TITLE_CLASS}>{title}</h2>
			<p className={SECTION_DESCRIPTION_CLASS}>{description}</p>
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
			radius="full"
			size="sm"
			variant="flat"
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
			radius="full"
			size="sm"
			variant="flat"
			onPress={onToggleTheme}
			aria-label={theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환"}
			className="border border-slate-200/80 bg-white/84 px-3 text-slate-800 shadow-sm transition-colors hover:bg-white dark:border-white/10 dark:bg-white/8 dark:text-white"
			startContent={
				isThemeReady ? (
					<Icon className="h-4 w-4" />
				) : (
					<span className="h-4 w-4 rounded-full bg-current/20" />
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
				<CardBody className="gap-4 p-6 md:p-7">
					<p className="text-sm font-semibold text-slate-900 dark:text-white">
						{item.label}
					</p>
					<p className="text-sm leading-6 text-slate-600 dark:text-white/60">
						{item.description}
					</p>
				</CardBody>
			</Card>
		</motion.div>
	);
}

function renderNarrativeCard(item: ProposalNarrativeCard) {
	const Icon = ICONS[item.iconKey];

	return (
		<motion.div key={item.title} variants={ITEM_VARIANTS}>
			<Card className={SURFACE_CARD_ELEVATED_CLASS}>
				<CardHeader className="items-start gap-4 pb-0">
					<div className={PANEL_ICON_CLASS}>
						<Icon className="h-5 w-5" />
					</div>
					<div className="space-y-1">
						<h3 className="text-lg font-semibold text-slate-900 dark:text-white">
							{item.title}
						</h3>
					</div>
				</CardHeader>
				<CardBody className={`pt-4 text-sm leading-7 ${MUTED_TEXT_CLASS}`}>
					{item.description}
				</CardBody>
			</Card>
		</motion.div>
	);
}

function renderProcessOutput(output: string) {
	return (
		<li
			key={output}
			className={`flex items-start gap-3 text-sm ${MUTED_TEXT_CLASS}`}
		>
			<BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
			<span>{output}</span>
		</li>
	);
}

function renderProcessCard(step: ProposalProcessStep) {
	const Icon = ICONS[step.iconKey];

	return (
		<motion.div key={step.step} variants={ITEM_VARIANTS}>
			<Card className={SURFACE_CARD_CLASS}>
				<CardHeader className="items-start justify-between gap-4">
					<div className="space-y-3">
						<Chip
							radius="full"
							variant="flat"
							color="primary"
							className="text-[11px] uppercase tracking-[0.24em]"
						>
							Step {step.step}
						</Chip>
						<h3 className="text-lg font-semibold text-slate-900 dark:text-white">
							{step.title}
						</h3>
					</div>
					<div className={PANEL_ICON_CLASS}>
						<Icon className="h-5 w-5" />
					</div>
				</CardHeader>
				<CardBody className={`gap-6 text-sm leading-7 ${MUTED_TEXT_CLASS}`}>
					<p>{step.description}</p>
					<ul className="space-y-2">{step.outputs.map(renderProcessOutput)}</ul>
				</CardBody>
			</Card>
		</motion.div>
	);
}

function renderCostLine(item: string) {
	return (
		<li
			key={item}
			className={`flex items-start gap-3 text-sm leading-7 ${MUTED_TEXT_CLASS}`}
		>
			<BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-primary" />
			<span>{item}</span>
		</li>
	);
}

function renderCareerLine(item: string) {
	return (
		<li
			key={item}
			className={`flex items-start gap-3 text-sm leading-7 ${MUTED_TEXT_CLASS}`}
		>
			<BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-secondary" />
			<span>{item}</span>
		</li>
	);
}

function renderResumeFactCard(item: ProposalResumeFact) {
	return (
		<motion.div key={item.label} variants={ITEM_VARIANTS}>
			<Card className={SURFACE_CARD_ELEVATED_CLASS}>
				<CardBody className="gap-3 p-6">
					<p className="text-[11px] font-semibold uppercase tracking-[0.26em] text-primary-700 dark:text-primary-300">
						{item.label}
					</p>
					<p className="text-lg font-semibold text-slate-950 dark:text-white">
						{item.value}
					</p>
					<p className={`text-sm leading-7 ${SOFT_TEXT_CLASS}`}>
						{item.description}
					</p>
				</CardBody>
			</Card>
		</motion.div>
	);
}

function renderToolChip(tool: string) {
	return (
		<Chip
			key={tool}
			variant="flat"
			radius="full"
			className="border border-slate-200/80 bg-slate-50/90 text-slate-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-white/78"
		>
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
				<CardHeader
					className={`flex-col items-start gap-5 border-b ${PANEL_DIVIDER_CLASS}`}
				>
					<div className="flex w-full items-start justify-between gap-4">
						<div className="space-y-3">
							<Chip radius="full" variant="flat" color="secondary">
								{entry.period}
							</Chip>
							<div className="space-y-2">
								<h3 className="text-xl font-semibold text-slate-950 dark:text-white">
									{entry.organization}
								</h3>
								<p className="text-sm font-semibold text-primary-700 dark:text-primary-300">
									{entry.role}
								</p>
								<p className={`text-sm leading-7 ${SOFT_TEXT_CLASS}`}>
									{entry.headline}
								</p>
							</div>
						</div>
						<div className={PANEL_ICON_CLASS}>
							<Icon className="h-5 w-5" />
						</div>
					</div>
				</CardHeader>
				<CardBody className="gap-6 p-6 md:p-7">
					<p className={`text-sm leading-7 ${MUTED_TEXT_CLASS}`}>
						{entry.description}
					</p>
					<ul className="space-y-3">
						{entry.highlights.map(renderCareerLine)}
					</ul>
					<div className="flex flex-row flex-wrap gap-2">
						{entry.tools.map(renderToolChip)}
					</div>
				</CardBody>
			</Card>
		</motion.div>
	);
}

function renderPortfolioCard(item: ProposalPortfolioItem) {
	const Icon = ICONS[item.iconKey];

	return (
		<motion.div key={item.title} variants={ITEM_VARIANTS}>
			<Card className={SURFACE_CARD_CLASS}>
				<CardHeader className="items-start gap-4 pb-0">
					<div className={PANEL_ICON_CLASS}>
						<Icon className="h-5 w-5" />
					</div>
					<div className="space-y-2">
						<h3 className="text-lg font-semibold text-slate-900 dark:text-white">
							{item.title}
						</h3>
						<p className={`text-sm leading-7 ${SOFT_TEXT_CLASS}`}>
							{item.description}
						</p>
					</div>
				</CardHeader>
				<CardBody className="gap-5 pt-5">
					<ul className="space-y-3">{item.highlights.map(renderCareerLine)}</ul>
					<div className="flex flex-row flex-wrap gap-2">
						{item.tools.map(renderToolChip)}
					</div>
				</CardBody>
			</Card>
		</motion.div>
	);
}

function renderStackCard(group: ProposalStackGroup) {
	return (
		<motion.div key={group.title} variants={ITEM_VARIANTS}>
			<Card className={SURFACE_CARD_ELEVATED_CLASS}>
				<CardHeader className="flex-col items-start gap-3">
					<Chip radius="full" variant="flat" color="secondary">
						{group.title}
					</Chip>
					<div className="space-y-2">
						<h3 className="text-lg font-semibold text-slate-900 dark:text-white">
							{group.title}
						</h3>
						<p className={`text-sm leading-7 ${SOFT_TEXT_CLASS}`}>
							{group.description}
						</p>
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
		<li
			key={bullet}
			className={`flex items-center gap-3 text-sm font-medium ${STRONG_TEXT_CLASS}`}
		>
			<BadgeCheck className="h-4 w-4 text-primary" />
			<span>{bullet}</span>
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
			<div className="sticky top-4 z-40 rounded-[28px] border border-slate-200/70 bg-white/72 px-5 py-5 shadow-[0_24px_80px_rgba(148,163,184,0.14)] backdrop-blur-xl md:px-8 dark:border-white/10 dark:bg-black/45 dark:shadow-none">
				<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary font-display text-lg font-semibold text-white dark:text-black">
							O
						</div>
						<div>
							<p className="font-display text-lg font-semibold text-slate-950 dark:text-white">
								온짓다
							</p>
							<p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-white/46">
								AI-centered delivery studio
							</p>
						</div>
					</div>
					<div className="flex flex-col gap-4 md:items-end">
						<div className="flex flex-wrap gap-3">
							{navigation.map(renderNavigationButton)}
						</div>
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
			<div className="space-y-12">
				<Chip
					radius="full"
					variant="flat"
					color="primary"
					className="border border-primary/20 bg-primary/10 px-3 py-5 text-[11px] font-semibold tracking-[0.32em] text-primary-700 dark:text-primary-200"
				>
					{hero.eyebrow}
				</Chip>
				<div className="space-y-7">
					<h1 className="font-display max-w-5xl text-5xl font-semibold leading-none text-slate-950 md:text-7xl dark:text-white">
						{hero.title}
					</h1>
					<p className="max-w-3xl text-base leading-8 text-slate-600 md:text-lg dark:text-white/70">
						{hero.description}
					</p>
				</div>
				<div className="flex flex-wrap gap-5">
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
						className="border border-slate-200 bg-white px-6 text-slate-900 shadow-sm hover:bg-slate-50 dark:border-white/12 dark:bg-white/6 dark:text-white dark:hover:bg-white/10"
					>
						{hero.secondaryAction.label}
					</Button>
				</div>
				<Divider className="bg-slate-200/80 dark:bg-white/10" />
				<motion.div
					className="grid gap-6 md:grid-cols-4"
					initial="hidden"
					animate="show"
					variants={GRID_VARIANTS}
				>
					{hero.metrics.map(renderMetricCard)}
				</motion.div>
			</div>
			<motion.div initial="hidden" animate="show" variants={GRID_VARIANTS}>
				<Card className="overflow-hidden border border-slate-200/80 bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(255,255,255,0.82))] shadow-[0_40px_120px_rgba(148,163,184,0.2)] dark:border-white/10 dark:bg-[linear-gradient(160deg,rgba(255,255,255,0.09),rgba(255,255,255,0.02))] dark:shadow-[0_40px_120px_rgba(0,0,0,0.34)]">
					<CardHeader
						className={`flex-col items-start gap-3 border-b bg-slate-950/[0.02] dark:bg-black/18 ${PANEL_DIVIDER_CLASS}`}
					>
						<Chip radius="full" variant="flat" color="secondary">
							Execution board
						</Chip>
						<div className="space-y-2">
							<h2 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
								기획에서 코드까지 같은 리듬으로 움직입니다
							</h2>
							<p className={`text-sm leading-7 ${SOFT_TEXT_CLASS}`}>
								화면, 스펙, 구현이 서로를 기다리지 않도록 실행 레이어를 촘촘하게
								맞춥니다.
							</p>
						</div>
					</CardHeader>
					<CardBody className="gap-6 p-6 md:p-8">
						{previewSteps.map(renderProcessCard)}
					</CardBody>
				</Card>
			</motion.div>
		</motion.section>
	);
}

export default observer(function ProposalPage() {
	const pageData = proposalPageData;
	const [theme, setTheme] = useState<ThemeMode>("light");
	const [isThemeReady, setIsThemeReady] = useState(false);

	useEffect(() => {
		const nextTheme = resolvePreferredTheme();
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

		applyTheme(nextTheme);
		setTheme(nextTheme);
		setIsThemeReady(true);

		const onChangeSystemThemeMediaQuery = (event: MediaQueryListEvent) => {
			const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

			if (
				storedTheme === "light" ||
				storedTheme === "dark" ||
				storedTheme === "system"
			) {
				return;
			}

			const systemTheme = event.matches ? "dark" : "light";
			applyTheme(systemTheme);
			setTheme(systemTheme);
		};

		mediaQuery.addEventListener("change", onChangeSystemThemeMediaQuery);

		return () => {
			mediaQuery.removeEventListener("change", onChangeSystemThemeMediaQuery);
		};
	}, []);

	const onClickThemeToggleButton = () => {
		const nextTheme = theme === "dark" ? "light" : "dark";

		window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
		applyTheme(nextTheme);
		setTheme(nextTheme);
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
			<main className="relative mx-auto w-full max-w-[90rem] px-5 pb-20 pt-8 md:px-8 md:pb-28 md:pt-10">
				<div className="pointer-events-none fixed bottom-0 left-0 h-[500px] w-[500px] -translate-x-1/2 translate-y-1/2 rounded-full bg-primary/16 blur-3xl dark:bg-primary/25" />
				<div className="pointer-events-none fixed right-0 top-0 h-[420px] w-[420px] translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/14 blur-3xl opacity-80 dark:bg-secondary/20" />
				<div className="relative overflow-hidden rounded-[32px] border border-slate-200/70 bg-white/64 px-6 py-10 shadow-[0_40px_140px_rgba(148,163,184,0.16)] backdrop-blur-xl md:px-14 md:py-14 dark:border-white/10 dark:bg-black/42 dark:shadow-[0_40px_140px_rgba(0,0,0,0.4)]">
					<Container className="mx-auto max-w-7xl gap-28 py-8 md:gap-36 md:py-12">
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
								<Card className="border border-danger/20 bg-danger/5 shadow-none">
									<CardHeader className="flex-col items-start gap-3">
										<Chip radius="full" variant="flat" color="danger">
											줄이는 비용
										</Chip>
										<h3 className="text-xl font-semibold text-slate-900 dark:text-white">
											없애도 되는 레이어
										</h3>
									</CardHeader>
									<CardBody>
										<ul className="space-y-4">
											{pageData.costModel.removed.map(renderCostLine)}
										</ul>
									</CardBody>
								</Card>
								<Card className="border border-success/20 bg-success/5 shadow-none">
									<CardHeader className="flex-col items-start gap-3">
										<Chip radius="full" variant="flat" color="success">
											남겨야 하는 비용
										</Chip>
										<h3 className="text-xl font-semibold text-slate-900 dark:text-white">
											사람이 붙잡아야 하는 레이어
										</h3>
									</CardHeader>
									<CardBody>
										<ul className="space-y-4">
											{pageData.costModel.focused.map(renderCostLine)}
										</ul>
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
							<Card className="border border-slate-200/80 bg-gradient-to-br from-white via-slate-50 to-primary/5 shadow-[0_30px_90px_rgba(148,163,184,0.18)] dark:border-white/10 dark:bg-gradient-to-br dark:from-white/10 dark:via-white/[0.05] dark:to-transparent dark:shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
								<CardBody className="gap-7 p-6 md:p-9">
									<div className="space-y-4">
										<Chip radius="full" variant="flat" color="primary">
											Closing note
										</Chip>
										<h3 className="font-display text-3xl font-semibold text-slate-950 md:text-4xl dark:text-white">
											{pageData.closing.title}
										</h3>
										<p className="max-w-3xl text-base leading-8 text-slate-600 dark:text-white/68">
											{pageData.closing.description}
										</p>
									</div>
									<ul className="grid gap-4 md:grid-cols-3">
										{pageData.closing.bullets.map(renderClosingBullet)}
									</ul>
								</CardBody>
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
								<Card className="border border-slate-200/80 bg-[linear-gradient(160deg,rgba(255,255,255,0.96),rgba(248,250,252,0.88))] shadow-[0_24px_80px_rgba(148,163,184,0.16)] dark:border-white/10 dark:bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] dark:shadow-none">
									<CardHeader
										className={`flex-col items-start gap-3 border-b ${PANEL_DIVIDER_CLASS}`}
									>
										<Chip radius="full" variant="flat" color="primary">
											Resume note
										</Chip>
										<div className="space-y-2">
											<h3 className="text-xl font-semibold text-slate-950 dark:text-white">
												{pageData.career.statement.title}
											</h3>
											<p className={`text-sm leading-7 ${SOFT_TEXT_CLASS}`}>
												{pageData.career.statement.description}
											</p>
										</div>
									</CardHeader>
									<CardBody>
										<ul className="space-y-4">
											{pageData.career.statement.bullets.map(renderCareerLine)}
										</ul>
									</CardBody>
								</Card>
							</div>
							<div className="space-y-6">
								<div className="space-y-3">
									<Chip radius="full" variant="flat" color="secondary">
										Portfolio
									</Chip>
									<h3 className="font-display text-2xl font-semibold text-slate-950 dark:text-white">
										이력서에 포함된 개인 포트폴리오와 학습 프로젝트
									</h3>
									<p
										className={`max-w-3xl text-sm leading-7 ${SOFT_TEXT_CLASS}`}
									>
										실서비스에 적용 가능한 구조를 목표로 운영 중인 개인
										프로젝트도 함께 노출합니다. 실무 경력 외에 어떤 방향으로
										역량을 확장하고 있는지도 보이도록 구성했습니다.
									</p>
								</div>
								<motion.div
									className="grid gap-6 md:grid-cols-2"
									initial="hidden"
									whileInView="show"
									viewport={VIEWPORT}
									variants={GRID_VARIANTS}
								>
									{pageData.career.portfolio.map(renderPortfolioCard)}
								</motion.div>
							</div>
						</LandingSection>
					</Container>
				</div>
			</main>
		</div>
	);
});
