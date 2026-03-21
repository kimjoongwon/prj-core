export type SectionId =
	| "problem"
	| "approach"
	| "process"
	| "cost"
	| "stack"
	| "fit";

export type ProposalIconKey =
	| "workflow"
	| "palette"
	| "files"
	| "brain"
	| "layers"
	| "boxes"
	| "sparkles"
	| "git"
	| "wrench"
	| "coins"
	| "timer"
	| "shield"
	| "rocket"
	| "dashboard"
	| "database"
	| "refresh";

export interface ProposalNavigationItem {
	id: SectionId;
	label: string;
}

export interface ProposalMetric {
	label: string;
	description: string;
}

export interface ProposalNarrativeCard {
	title: string;
	description: string;
	iconKey: ProposalIconKey;
}

export interface ProposalProcessStep {
	step: string;
	title: string;
	description: string;
	outputs: string[];
	iconKey: ProposalIconKey;
}

export interface ProposalAction {
	label: string;
	target: SectionId;
}

export interface ProposalStackGroup {
	title: string;
	description: string;
	tools: string[];
}

export interface ProposalPageData {
	navigation: ProposalNavigationItem[];
	hero: {
		eyebrow: string;
		title: string;
		description: string;
		primaryAction: ProposalAction;
		secondaryAction: ProposalAction;
		metrics: ProposalMetric[];
	};
	problems: ProposalNarrativeCard[];
	approach: ProposalNarrativeCard[];
	process: ProposalProcessStep[];
	costModel: {
		title: string;
		description: string;
		benefits: ProposalNarrativeCard[];
		removed: string[];
		focused: string[];
	};
	stack: ProposalStackGroup[];
	projectFits: ProposalNarrativeCard[];
	closing: {
		title: string;
		description: string;
		bullets: string[];
	};
}

export const proposalPageData = {
	navigation: [
		{ id: "problem", label: "왜 AI 외주인가" },
		{ id: "approach", label: "작업 방식" },
		{ id: "process", label: "실행 흐름" },
		{ id: "cost", label: "비용 최적화" },
		{ id: "stack", label: "기술 스택" },
		{ id: "fit", label: "적합한 프로젝트" },
	],
	hero: {
		eyebrow: "AI-FIRST PRODUCT DELIVERY",
		title: "자자는 AI 주도로 외주 개발의 왕복 비용을 다시 설계합니다.",
		description:
			"고급 인력으로 수주하고 실제 제작은 저연차 체인으로 내려가는 구조, 그리고 AI가 이미 80% 수준의 초안을 만들 수 있는 시대에도 남아 있는 어중간한 계층. 자자는 그 병목을 줄이고 senior 판단, AI 실행 보조, Code 중심 설계를 한 구조 안에 묶습니다. 우리와 거래하는 것은 단순 인력 투입이 아니라 AI 개발 플로우 전체와 거래하는 것이고, 그 결과물은 정적인 시안보다 Storybook 위에서 더 정확하게 공유됩니다.",
		primaryAction: {
			label: "실행 방식 보기",
			target: "process",
		},
		secondaryAction: {
			label: "기술 기반 보기",
			target: "stack",
		},
		metrics: [
			{
				label: "기획-구현 간극 축소",
				description: "요구사항을 곧바로 화면 구조와 도메인 설계로 연결합니다.",
			},
			{
				label: "Code to Storybook",
				description:
					"정적 시안보다 코드와 상태를 Storybook에서 바로 검토하는 흐름을 우선합니다.",
			},
			{
				label: "반복 작업 자동화",
				description: "문서 초안, 정합성 체크, 구현 보조를 AI가 맡습니다.",
			},
			{
				label: "2년 유지보수 보장",
				description:
					"출시 후에도 끝까지 책임지는 구조를 전제로 설계하고 인수인계합니다.",
			},
		],
	},
	problems: [
		{
			title: "수주는 시니어가 하고, 제작은 저연차에게 내려가는 일이 흔합니다",
			description:
				"제안과 수주 단계에서는 고급 인력이 전면에 서지만, 실제 제작이 저연차 체인으로 내려가면 판단의 밀도는 낮아집니다. 고객은 senior 단가를 지불하고도 junior delivery를 받게 되는 구조가 생깁니다.",
			iconKey: "workflow",
		},
		{
			title: "AI 시대에는 기획, 디자인, 개발 모두 80% 수준 초안이 빨라졌습니다",
			description:
				"문서 초안, 화면 초안, CRUD 구현, 정리 작업은 이미 AI로 일정 수준 이상 빠르게 만들 수 있습니다. 이때 품질을 크게 올리지 못하는 중간 계층은 가치보다 전달 비용을 더 키우기 쉽습니다.",
			iconKey: "palette",
		},
		{
			title:
				"정적인 시안보다 실행 가능한 Code와 Storybook이 기준이 되는 구조가 필요합니다",
			description:
				"정적인 시안 파일이 기준이 되면 다시 구현으로 번역해야 합니다. 이제는 Code가 Design System의 기준이 되고, Storybook이 그 변형과 상태를 검토하는 공유면이 되어야 더 빠르고 정확합니다.",
			iconKey: "layers",
		},
		{
			title: "어중간한 계층이 많을수록 비용과 일정은 함께 늘어납니다",
			description:
				"중간 PM, 중간 기획, 중간 디자인 번역자가 많아질수록 전달자는 늘고 책임은 흐려집니다. 수정 속도는 느려지고, 문서와 코드의 정합성 유지 비용이 구조적으로 커집니다.",
			iconKey: "files",
		},
	],
	approach: [
		{
			title: "시니어 판단과 AI 실행 보조를 한 레이어로 묶습니다",
			description:
				"요구사항 해석, 우선순위, 예외 판단은 senior가 맡고, 초안 생성과 반복 정리는 AI가 맡습니다. 병목이 되던 어중간한 중간 계층을 줄여 의사결정 밀도를 높입니다.",
			iconKey: "brain",
		},
		{
			title: "디자인은 납품물이 아니라 검증 가능한 실행 레이어입니다",
			description:
				"AI가 80% 수준의 화면 초안은 이미 빠르게 만듭니다. 그래서 중요한 것은 시안 개수가 아니라, HeroUI 기반 UI 시스템 위에서 정보 구조와 사용성을 바로 검증하는 방식입니다. 우리는 Code를 기준 자산으로 두고, Storybook을 통해 상태와 변형을 함께 검토합니다.",
			iconKey: "layers",
		},
		{
			title: "남는 경쟁력은 마지막 20%를 누가 정확하게 판단하느냐입니다",
			description:
				"기획도 개발도 초안 생산 속도는 빨라졌습니다. 그래서 제품의 차이는 더 많은 중간 산출물이 아니라, 핵심 흐름과 데이터 정합성을 누가 더 정확하게 연결하느냐에서 나옵니다. 기획과 디자인 역시 Code 중심으로 붙어야 병목 없이 움직입니다.",
			iconKey: "boxes",
		},
	],
	process: [
		{
			step: "01",
			title: "요구사항을 구조화된 입력으로 변환",
			description:
				"기능 요청을 화면 흐름, 상태, 데이터 단위로 나누어 이후 구현 단계가 바로 이어질 수 있게 만듭니다.",
			outputs: ["페이지 흐름", "핵심 사용자 시나리오", "우선순위"],
			iconKey: "sparkles",
		},
		{
			step: "02",
			title: "도메인과 API 경계를 먼저 고정",
			description:
				"무엇을 저장하고, 어디서 검증하며, 어떤 응답 계약으로 연결할지 먼저 잠가 프론트와 백엔드의 기준점을 만듭니다.",
			outputs: ["도메인 모델", "API 계약", "상태 경계"],
			iconKey: "git",
		},
		{
			step: "03",
			title: "HeroUI 기반 화면을 즉시 조립",
			description:
				"별도 디자인 납품물을 오래 왕복하지 않고, 바로 동작하는 화면 위에서 정보 구조와 피드백을 검증합니다. 기준 자산은 Code이고, Storybook이 리뷰와 공유의 기준 화면이 됩니다.",
			outputs: ["정보 구조", "실행 가능한 UI", "Storybook review surface"],
			iconKey: "layers",
		},
		{
			step: "04",
			title: "구현과 검토를 병렬로 진행",
			description:
				"AI가 초안과 반복 작업을 지원하고, 사람은 예외 처리와 품질 판단에 집중해 리드타임을 줄입니다.",
			outputs: ["페이지 구현", "도메인 로직", "sidecar spec"],
			iconKey: "wrench",
		},
		{
			step: "05",
			title: "검증 가능한 산출물로 정리",
			description:
				"테스트 초안, 문서, 운영 관점을 함께 묶어 이후 인수인계와 확장 비용까지 같이 낮춥니다.",
			outputs: ["검증 포인트", "문서화", "확장 가능한 구조"],
			iconKey: "shield",
		},
	],
	costModel: {
		title: "AI 시대에 비싼 것은 구현 그 자체보다 병목 계층입니다",
		description:
			"AI가 기획, 디자인, 개발의 80% 수준 초안을 빠르게 만들 수 있는 시대에는, 어중간한 중간 계층을 많이 두는 구조가 오히려 예산과 개발 시간을 태웁니다. 우리는 줄여도 되는 비용과 반드시 남겨야 하는 비용을 분리합니다.",
		benefits: [
			{
				title: "중간 전달 비용 감소",
				description:
					"같은 요구사항을 여러 역할에 반복 전달하는 시간을 줄이고, 판단 주체와 실행 주체의 거리를 좁힙니다.",
				iconKey: "coins",
			},
			{
				title: "수정 속도 향상",
				description:
					"중간 번역 계층을 줄여 문서, 화면, 코드가 같은 방향을 보게 만들고 재작업 시간을 줄입니다.",
				iconKey: "timer",
			},
			{
				title: "시니어 판단 밀도 확보",
				description:
					"AI로 대체 가능한 반복 대신, 제품 우선순위와 예외 케이스 같은 고난도 판단에 senior 시간을 씁니다.",
				iconKey: "shield",
			},
		],
		removed: [
			"수주 단계의 고급 인력과 실제 제작 인력 사이의 괴리",
			"중간 전달자 중심의 기획, 디자인, 개발 번역 레이어",
			"AI로 대체 가능한 80% 초안 작업의 반복 인건비",
			"시안, 문서, 코드가 분리되어 생기는 후반부 정리 비용",
		],
		focused: [
			"사용자 흐름 우선순위와 제품 판단",
			"핵심 화면의 정보 위계와 실제 사용성",
			"예외 케이스, 권한, 데이터 정합성 검토",
			"운영 가능한 구조와 릴리즈 품질 판단",
			"출시 후 2년 유지보수를 전제로 한 책임 구조",
		],
	},
	stack: [
		{
			title: "Foundation",
			description: "모노레포와 타입 안정성을 기준으로 실행 속도를 높입니다.",
			tools: ["Turborepo", "pnpm", "TypeScript", "React 19"],
		},
		{
			title: "Experience Layer",
			description:
				"화면 조립과 상태 관리를 빠르게 검증할 수 있는 프론트 레이어입니다.",
			tools: [
				"Next.js App Router",
				"MobX",
				"HeroUI",
				"Tailwind CSS",
				"Orval",
				"React Query",
			],
		},
		{
			title: "Backend & Data",
			description: "비즈니스 규칙과 데이터 일관성을 안정적으로 묶습니다.",
			tools: ["NestJS", "Prisma", "PostgreSQL", "Redis"],
		},
		{
			title: "Quality & Operations",
			description: "반복 검증과 운영 준비를 자동화 가능한 체계로 묶습니다.",
			tools: ["Biome", "Jest", "Vitest", "Storybook", "AWS S3", "Sharp"],
		},
	],
	projectFits: [
		{
			title: "빠르게 MVP를 검증해야 하는 팀",
			description:
				"기획 문서보다 동작하는 화면과 핵심 흐름 검증이 더 중요한 제품에 잘 맞습니다.",
			iconKey: "rocket",
		},
		{
			title: "운영 어드민이 중요한 서비스",
			description:
				"복잡한 운영 화면, 권한, 상태 전이가 중요한 내부 도구나 백오피스 구축에 적합합니다.",
			iconKey: "dashboard",
		},
		{
			title: "데이터 흐름이 중요한 플랫폼",
			description:
				"예약, 워크플로, 관리형 SaaS처럼 프론트와 백엔드의 정합성이 중요한 프로젝트에 유리합니다.",
			iconKey: "database",
		},
		{
			title: "기존 외주 방식을 다시 설계하려는 팀",
			description:
				"느린 handoff와 긴 산출물 왕복을 줄이고 실행 밀도를 높이려는 리뉴얼 프로젝트에 적합합니다.",
			iconKey: "refresh",
		},
		{
			title: "끝까지 책임지는 파트너가 필요한 팀",
			description:
				"출시만 하고 빠지는 구조가 아니라, 2년 유지보수 보장을 전제로 운영 이슈와 확장 요구까지 함께 가져갈 파트너를 찾는 팀에 맞습니다.",
			iconKey: "shield",
		},
	],
	closing: {
		title:
			"AI 시대에 필요한 것은 더 많은 중간 단계가 아니라, 더 정확한 판단 구조입니다",
		description:
			"자자는 외주를 인력 수 경쟁으로 보지 않습니다. 고급으로 수주하고 저연차로 제작하는 구조, 그리고 AI로 이미 빨라진 80% 초안 영역 위에 또 다른 병목 계층을 쌓는 구조를 줄입니다. 우리는 Figma 산출물 중심 전달보다 Code-first design과 Storybook 기반 검토가 더 정확하다고 봅니다. 같은 예산에서 더 높은 실행 밀도를 만들고, 출시 후 2년 유지보수까지 책임지는 것이 우리의 방식입니다.",
		bullets: [
			"고급 수주와 실제 제작의 괴리를 줄입니다.",
			"AI가 할 80%는 자동화하고 사람은 20% 판단에 집중합니다.",
			"Code to Storybook으로 코드와 디자인 리뷰를 같은 기준 화면에서 공유합니다.",
			"2년 유지보수 보장으로 끝까지 책임집니다.",
		],
	},
} satisfies ProposalPageData;
