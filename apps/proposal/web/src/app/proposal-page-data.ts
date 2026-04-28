export type SectionId =
	| "problem"
	| "approach"
	| "process"
	| "cost"
	| "stack"
	| "fit"
	| "career";

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

export interface ProposalCareerEntry {
	period: string;
	organization: string;
	role: string;
	headline: string;
	description: string;
	highlights: string[];
	tools: string[];
	iconKey: ProposalIconKey;
}

export interface ProposalResumeFact {
	label: string;
	value: string;
	description: string;
}

export interface ProposalPortfolioItem {
	title: string;
	description: string;
	highlights: string[];
	tools: string[];
	iconKey: ProposalIconKey;
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
	career: {
		title: string;
		description: string;
		summary: ProposalMetric[];
		entries: ProposalCareerEntry[];
		credentials: ProposalResumeFact[];
		statement: {
			title: string;
			description: string;
			bullets: string[];
		};
		portfolio: ProposalPortfolioItem[];
	};
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
		title:
			"온짓다는 1명의 고급 개발자와 AI로 외주 구조 자체를 다시 설계합니다.",
		description:
			"기획, 디자인, 개발을 senior 한 명이 일관되게 책임지고 AI는 초안 생성, 반복 구현, 문서 정리를 보조합니다. 그래서 고급 인력으로 수주한 뒤 실제 제작은 신입 체인으로 내려가는 구조, 빠르게만 만든 바이브 코드가 유지보수 비용으로 돌아오는 구조를 피합니다. 결과물은 정적인 시안이 아니라 Storybook, 테스트, 도메인 설계, GitOps 배포 흐름까지 연결된 지속 가능한 제품입니다.",
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
				label: "1 Senior + AI",
				description:
					"기획, 디자인, 개발의 맥락을 한 명이 끊김 없이 연결하고 AI로 반복 작업을 압축합니다.",
			},
			{
				label: "공식 단가 기준 검증",
				description:
					"2026년 적용 SW기술자 평균임금과 최저임금 기준으로 왜 싼 외주가 무너지는지 숫자로 설명합니다.",
			},
			{
				label: "Code to Storybook",
				description:
					"정적 시안보다 코드와 상태를 Storybook에서 바로 검토하는 흐름을 우선합니다.",
			},
			{
				label: "테스트와 운영까지",
				description:
					"핵심 로직 E2E, 높은 테스트 밀도, GitOps 기반 운영 흐름까지 함께 설계합니다.",
			},
		],
	},
	problems: [
		{
			title:
				"시니어를 팔고 실제 제작은 신입 체인으로 내려가는 일이 아직도 흔합니다",
			description:
				"제안과 수주 단계에서는 고급 인력이 전면에 서지만, 실제 제작이 저연차 체인으로 내려가면 판단 밀도와 책임 소재가 동시에 무너집니다. 고객은 senior 단가를 지불하고도 junior delivery를 받게 되는 구조가 생깁니다.",
			iconKey: "workflow",
		},
		{
			title:
				"싸게 보이는 팀 견적은 역할을 나누면 사실상 최저임금 근처로 내려갑니다",
			description:
				"예를 들어 월 1,000만원 견적으로 PM, 기획/디자인, 개발까지 네 역할을 약속하면 1인당 월 250만원 수준입니다. 2026년 최저임금 월 2,156,880원에 회사 간접비와 마진을 더하면 실제 실행 인력은 사실상 최저임금에 가까워지고, 그 차이는 결국 역할 생략이나 저연차 투입으로 메워집니다.",
			iconKey: "palette",
		},
		{
			title:
				"바이브 코딩은 데모는 빠르지만 유지보수 단계에서 더 큰 비용을 부릅니다",
			description:
				"맥락 없이 이어붙인 코드, 테스트 없는 상태, 도메인 경계 없이 급하게 만든 CRUD는 첫 화면은 빨리 보여도 수정과 인수인계에서 급격히 무너집니다. 유지보수 불가능한 결과물은 초기 견적이 아니라 이후 운영비로 대가를 치르게 만듭니다.",
			iconKey: "layers",
		},
		{
			title:
				"정적인 시안보다 실행 가능한 Code, Storybook, 테스트가 기준이어야 합니다",
			description:
				"정적인 시안 파일이 기준이 되면 다시 구현으로 번역해야 합니다. 이제는 Code가 디자인 시스템의 기준이 되고, Storybook과 테스트가 변형과 상태를 검증하는 공유면이 되어야 더 빠르고 정확합니다.",
			iconKey: "files",
		},
	],
	approach: [
		{
			title: "한 명의 고급 개발자가 AI와 함께 전체 흐름을 끝까지 책임집니다",
			description:
				"요구사항 해석, 정보 구조, 예외 판단, 도메인 설계는 senior가 맡고 AI는 초안 생성, 정리, 반복 구현을 맡습니다. handoff가 줄어들고 품질 책임이 분산되지 않기 때문에 의사결정과 결과물이 같은 맥락을 유지합니다.",
			iconKey: "brain",
		},
		{
			title: "디자인은 납품물이 아니라 검증 가능한 실행 레이어입니다",
			description:
				"AI가 80% 수준의 화면 초안은 이미 빠르게 만듭니다. 그래서 중요한 것은 시안 개수가 아니라, HeroUI 기반 UI 시스템 위에서 정보 구조와 사용성을 바로 검증하는 방식입니다. 우리는 Code를 기준 자산으로 두고 Storybook에서 상태와 변형을 리뷰해 디자인과 구현을 분리하지 않습니다.",
			iconKey: "layers",
		},
		{
			title:
				"품질은 출시 직전 QA가 아니라 처음부터 테스트와 운영 구조로 만듭니다",
			description:
				"핵심 로직은 높은 테스트 밀도와 E2E 경로로 검증하고, 배포는 GitOps와 Helm 기반 Kubernetes 운영 흐름까지 고려해 설계합니다. 빠르게 만드는 것보다 출시 후에도 손댈 수 있는 구조를 남기는 것이 더 중요합니다.",
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
			title: "구현, 테스트, 검토를 병렬로 진행",
			description:
				"AI가 초안과 반복 작업을 지원하고, 사람은 예외 처리와 품질 판단에 집중합니다. 화면 구현과 도메인 로직, 테스트 초안을 함께 움직여 리드타임은 줄이고 회귀 위험은 낮춥니다.",
			outputs: ["페이지 구현", "도메인 로직", "테스트 시나리오"],
			iconKey: "wrench",
		},
		{
			step: "05",
			title: "운영 가능한 산출물로 마무리",
			description:
				"핵심 로직 테스트, E2E 흐름, 운영 문서, 배포 기준을 함께 묶어 이후 인수인계와 확장 비용까지 같이 낮춥니다.",
			outputs: ["핵심 시나리오 E2E", "운영 문서", "확장 가능한 구조"],
			iconKey: "shield",
		},
	],
	costModel: {
		title: "공식 단가로 계산해 보면, 싼 외주의 구조적 한계가 바로 드러납니다",
		description:
			"2026년 적용 SW기술자 평균임금 기준으로 IT PM은 일 492,039원, UI/UX 기획·개발자는 일 336,666원, UI/UX 디자이너는 일 251,671원, 응용 SW 개발자는 일 378,250원입니다. 네 역할을 20영업일만 잡아도 월 약 2,917만원입니다. 반대로 월 1,000만원 견적으로 네 역할을 약속하면 1인당 월 250만원 수준이라 2026년 최저임금 월 2,156,880원과 사실상 비슷한 구간으로 수렴합니다. 이 차이는 결국 신입 체인, 역할 생략, 유지보수 불가한 바이브 코드로 메워지기 쉽습니다.",
		benefits: [
			{
				title: "공식 수치로 보면 싼 이유가 보입니다",
				description:
					"기획·디자인·개발을 따로 파는 다인 팀 견적이 충분히 낮다면, 그 차액은 결국 senior 시간이 아니라 실행 품질에서 빠질 가능성이 큽니다.",
				iconKey: "coins",
			},
			{
				title: "가짜 다인 팀보다 1 Senior + AI가 더 정직합니다",
				description:
					"우리는 여러 명이 붙는 척 견적을 부풀리지 않습니다. 한 명의 senior builder가 전체 맥락을 잡고 AI로 반복 작업을 줄이기 때문에 품질 책임과 커뮤니케이션 경로가 단순합니다.",
				iconKey: "timer",
			},
			{
				title: "유지보수 가능한 코드가 총비용을 낮춥니다",
				description:
					"초기 데모만 빠른 코드가 아니라 테스트, 도메인 경계, 운영 기준이 남는 코드를 만들어야 다음 기능과 유지보수에서 비용이 폭발하지 않습니다.",
				iconKey: "shield",
			},
		],
		removed: [
			"고급으로 수주하고 저연차 체인으로 제작하는 괴리",
			"중간 전달자 중심의 기획, 디자인, 개발 번역 레이어",
			"AI로 대체 가능한 80% 초안 작업의 반복 인건비",
			"테스트 없이 빠르게 만든 바이브 코드의 후반부 정리 비용",
		],
		focused: [
			"기획, 디자인, 개발을 한 맥락으로 책임지는 senior 소유권",
			"핵심 화면의 정보 위계와 실제 사용성",
			"예외 케이스, 권한, 데이터 정합성 검토",
			"핵심 로직 자동화 테스트와 E2E 검증",
			"GitOps 기반 운영 구조와 출시 후 확장 가능한 유지보수 기준",
		],
	},
	stack: [
		{
			title: "Foundation",
			description:
				"모노레포와 타입 안정성을 기준으로 기획, 설계, 구현이 같은 기준 위에서 움직이게 만듭니다.",
			tools: ["Turborepo", "pnpm", "TypeScript", "React 19"],
		},
		{
			title: "Experience Layer",
			description:
				"화면 조립과 상태 관리를 빠르게 검증하고, Storybook으로 디자인과 구현을 같은 리뷰 면에서 확인합니다.",
			tools: [
				"Next.js App Router",
				"MobX",
				"HeroUI",
				"Tailwind CSS",
				"Orval",
				"Storybook",
			],
		},
		{
			title: "Backend & Data",
			description:
				"비즈니스 규칙, 권한, 데이터 일관성을 도메인 경계 안에서 안정적으로 묶습니다.",
			tools: ["NestJS", "Prisma", "PostgreSQL", "Redis"],
		},
		{
			title: "Quality & Operations",
			description:
				"자동화 테스트, 핵심 로직 E2E, Jenkins, GitOps/Helm 기반 Kubernetes 배포 흐름까지 운영 가능한 체계로 묶습니다.",
			tools: [
				"Biome",
				"Jest",
				"Vitest",
				"Playwright",
				"Jenkins",
				"GitOps",
				"Helm",
				"Kubernetes",
			],
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
			title: "기존 외주 실패를 다시 설계하려는 팀",
			description:
				"느린 handoff, 시니어 수주 후 신입 제작, 유지보수 불가한 결과물에 지친 팀이 실행 밀도를 다시 세우는 프로젝트에 적합합니다.",
			iconKey: "refresh",
		},
		{
			title: "끝까지 책임지는 파트너가 필요한 팀",
			description:
				"출시만 하고 빠지는 구조가 아니라, 운영 이슈와 확장 요구까지 함께 가져갈 파트너를 찾는 팀에 맞습니다.",
			iconKey: "shield",
		},
	],
	career: {
		title: "이 제안을 실행하는 사람의 배경도 결과물만큼 실전 중심입니다",
		description:
			"상단은 delivery model을 설명하고, 아래는 그 모델을 실제로 굴려 온 경력을 정리했습니다. 이력서처럼 개인 정보를 늘어놓기보다 제품 범위, 책임 수준, 기술 판단이 드러나는 프로젝트 경험만 추렸습니다.",
		summary: [
			{
				label: "6년 4개월 실무",
				description:
					"엔터프라이즈, 시험, 커머스, 커뮤니티, 콘텐츠 운영을 거친 실서비스 경력입니다.",
			},
			{
				label: "SK mySUNI 재직 중",
				description:
					"현재 SK 그룹사 학습·HR 플랫폼의 웹, 앱, 관리자 기능을 고도화하고 있습니다.",
			},
			{
				label: "Web · App · Admin",
				description:
					"React, React Native, Node.js, NestJS를 바탕으로 사용자 화면과 운영 도구를 함께 다룹니다.",
			},
			{
				label: "설계부터 운영까지",
				description:
					"마이그레이션, 테스트 체계, 배포, 스토어 심사까지 연결해 결과물을 운영 가능한 상태로 마무리합니다.",
			},
		],
		entries: [
			{
				period: "2022.10 - Present",
				organization: "SK마이써니",
				role: "프론트엔드 · 모바일 리드",
				headline:
					"엔터프라이즈 학습·HR 플랫폼에서 대내·대외 앱과 웹 서비스를 함께 운영",
				description:
					"mySUNI, Connect mySUNI, 커리어플랫폼으로 이어지는 제품군에서 모바일 네이티브 앱 영역을 단독 책임지고, 웹 학습 서비스와 관리자 기능 고도화를 병행했습니다.",
				highlights: [
					"Ionic 기반 앱을 React Native로 마이그레이션하고, 대내·대외 2개 앱 구조를 유지한 채 전환했습니다.",
					"스토어 심사, 배포, 인증서 관리, 네이티브 브릿지, 앱 라이프사이클을 직접 운영했습니다.",
					"학습 메인 로직, 플레이리스트, 관리자 회원 서비스, PV 통계 구조를 개선했습니다.",
					"Storybook, MSW, Vitest 기반 프론트엔드 품질 체계를 설계하고 운영했습니다.",
				],
				tools: [
					"React",
					"React Native",
					"Ionic Migration",
					"Storybook",
					"MSW",
					"Vitest",
				],
				iconKey: "workflow",
			},
			{
				period: "2022.01 - 2022.08",
				organization: "CRAA",
				role: "개발 팀장",
				headline: "시험, 학습, 감독, 어드민을 포함한 온라인 평가 플랫폼을 리드",
				description:
					"시험 응시, 동영상 학습, 감독, 채점, 운영 어드민까지 하나의 제품군으로 이어지는 온라인 시험 플랫폼에서 프론트엔드 구조와 백엔드 계약을 동시에 설계했습니다.",
				highlights: [
					"디자인 시스템을 구축하고 디자인 협업 기준을 세워 UI 일관성을 구조적으로 유지했습니다.",
					"Lerna 기반 모노레포를 설계해 프론트엔드, 백엔드, 공유 자산을 같은 기준으로 관리했습니다.",
					"Orval과 Swagger Introspection을 기반으로 모델과 Query 자동 생성 흐름을 구축했습니다.",
					"시험 사이트와 어드민을 1인 주도로 개발하고, WebRTC 기반 실시간 감독 기능까지 구현했습니다.",
				],
				tools: ["React", "NestJS", "AWS", "WebRTC", "Lerna", "Orval"],
				iconKey: "shield",
			},
			{
				period: "2021.01 - 2021.12",
				organization: "마이허브앤헬스케어",
				role: "개발 팀장",
				headline:
					"헬스케어 앱과 동영상 강의 CMS를 함께 구축하며 도메인과 운영을 정리",
				description:
					"건강기능식품 성분 관리 앱 MyHub와 동영상 강의 CMS 교무실을 개발하며 모바일 앱, 관리자 웹, API, 데이터 스키마, 클라우드 운영 구조를 한 흐름으로 다뤘습니다.",
				highlights: [
					"React Native 앱, React 어드민 웹, Spring Boot 및 NestJS API를 직접 설계하고 개발했습니다.",
					"PostgreSQL 기반 성분 데이터와 강의 콘텐츠 관리 스키마를 도메인 중심으로 설계했습니다.",
					"AWS EKS, S3, CloudFront, EC2를 연계해 배포와 운영 구조를 1인 체제로 구축했습니다.",
				],
				tools: [
					"React Native",
					"React",
					"NestJS",
					"Spring Boot",
					"PostgreSQL",
					"AWS EKS",
				],
				iconKey: "database",
			},
			{
				period: "2019.06 - 2020.09",
				organization: "스마트링크커뮤니케이션",
				role: "풀스택 개발자",
				headline:
					"SNS, 커뮤니티, 커머스, 예약배송, 스케줄 관리까지 다도메인 서비스를 수행",
				description:
					"PLEZUS, FIRSTEP, Sugar Market, ONEDO, AllBasket, 회사가요 등 여러 제품을 거치며 사용자 화면, 관리자, 커머스 로직, 멀티 테넌트 구조, 배포까지 폭넓은 범위를 경험했습니다.",
				highlights: [
					"채팅, 팔로우, 프로필, 게시판 등 SNS와 커뮤니티 핵심 화면 및 상태 관리를 구현했습니다.",
					"상품, 주문, 결제, 정산 구조를 설계하고 부트페이, KG이니시스 연동까지 포함한 커머스 로직을 구현했습니다.",
					"멀티 테넌트 구조를 설계해 단일 스토어와 다중 스토어를 모두 지원하는 코드를 확장했습니다.",
					"예약 배송 쇼핑몰과 스케줄 관리 서비스를 1인 풀스택 형태로 설계하고 개발했습니다.",
				],
				tools: ["React", "React Native", "Node.js", "MobX", "MongoDB", "AWS"],
				iconKey: "refresh",
			},
		],
		credentials: [
			{
				label: "학력",
				value: "부경대학교 전자공학과",
				description: "2008.03 - 2016.03 졸업",
			},
			{
				label: "자격",
				value: "정보처리기사",
				description: "한국산업인력공단 · 2019.06 취득",
			},
			{
				label: "현재 역할",
				value: "SK mySUNI · Connect mySUNI",
				description:
					"엔터프라이즈 학습·HR 플랫폼의 프론트엔드, 모바일, 관리자 기능 고도화",
			},
			{
				label: "핵심 영역",
				value: "Frontend · Mobile · Backend",
				description:
					"React, React Native, Node.js, NestJS, PostgreSQL, Kubernetes 중심",
			},
		],
		statement: {
			title: "자기소개 요약",
			description:
				"이력서 본문에서는 설계 중심 사고, 다양한 도메인에서의 빠른 구조 판단, 그리고 AI를 활용한 생산성 향상을 핵심 강점으로 설명하고 있습니다. 제안서 하단에서는 그 내용을 프로젝트 수행 관점으로 다시 정리합니다.",
			bullets: [
				"기능 구현보다 먼저 도메인에 맞는 데이터 모델링과 트랜잭션 흐름을 정리해 재작업 비용을 낮춥니다.",
				"커머스, 채팅, SNS, 학습, 시험, CMS 등 다양한 도메인을 직접 설계한 경험을 바탕으로 상황별 구조를 빠르게 제안합니다.",
				"AI를 구조 검증과 대안 비교 도구로 적극 활용해 반복 작업의 생산성을 높이고, 사람은 핵심 판단에 집중합니다.",
				"빠르게만 만드는 개발보다 적게 고민하고도 더 나은 결정을 내릴 수 있는 구조를 만드는 것을 지향합니다.",
			],
		},
		portfolio: [
			{
				title: "prj-core 풀스택 예약 플랫폼",
				description:
					"예약 도메인을 중심으로 사용자, 권한, 일정 구조를 설계한 모노레포 기반 풀스택 서비스입니다.",
				highlights: [
					"프론트엔드, 백엔드, 도메인 레이어를 일관성 있게 관리하는 모노레포 구조를 설계했습니다.",
					"실서비스 확장을 고려한 Prisma 스키마와 API 구조를 정리했습니다.",
				],
				tools: ["NestJS", "React", "Prisma", "PostgreSQL", "Turborepo"],
				iconKey: "database",
			},
			{
				title: "prj-mobile 예약 서비스 앱",
				description:
					"prj-core와 연동되는 모바일 애플리케이션으로, UI 품질과 재사용성을 중심으로 설계했습니다.",
				highlights: [
					"Storybook 기반 컴포넌트 관리 흐름을 적용해 모바일 UI 품질을 높였습니다.",
					"실서비스 배포를 고려한 앱 구조와 상태 관리 기준을 실험했습니다.",
				],
				tools: ["React Native", "Expo", "Storybook"],
				iconKey: "rocket",
			},
			{
				title: "prj-devops GitOps 배포 환경",
				description:
					"Kubernetes 환경에서 선언형 배포와 운영 자동화를 실험하는 개인 DevOps 프로젝트입니다.",
				highlights: [
					"ArgoCD 기반 GitOps 흐름과 Helm 배포 구조를 설계했습니다.",
					"인프라를 코드로 관리하는 운영 체계를 정리했습니다.",
				],
				tools: ["Kubernetes", "ArgoCD", "Helm", "OpenBao"],
				iconKey: "shield",
			},
			{
				title: "prj-llm 업무 자동화 API",
				description:
					"Notion, Git 컨텍스트, LLM을 결합해 업무 맥락을 분석·정리하는 자동화 API 프로젝트입니다.",
				highlights: [
					"RAG 기반 LLM API 구조와 벡터 검색 흐름을 설계했습니다.",
					"Task 등록과 Git branch 컨텍스트를 연결하는 요약 자동화 파이프라인을 실험했습니다.",
				],
				tools: ["FastAPI", "LangChain", "ChromaDB", "Notion API"],
				iconKey: "sparkles",
			},
		],
	},
	closing: {
		title: "싼 견적보다 중요한 것은 누가 끝까지 책임지는가입니다",
		description:
			"공식 단가 기준으로 계산하면, 고급 인력처럼 보이는 값싼 회사 견적은 대부분 신입 체인이나 역할 생략으로 이어집니다. 온짓다는 가짜 다인 구성을 약속하지 않습니다. 한 명의 senior builder가 AI를 도구로 기획, 디자인, 개발을 연결하고 Storybook, 자동화 테스트, GitOps 배포 흐름까지 남겨 출시 후에도 유지보수 가능한 제품을 만듭니다.",
		bullets: [
			"고급 수주 후 신입 제작 구조를 피합니다.",
			"AI가 할 80%는 자동화하고 senior는 핵심 20% 판단에 집중합니다.",
			"Code to Storybook으로 코드와 디자인 리뷰를 같은 기준 화면에서 공유합니다.",
			"핵심 로직 테스트와 E2E로 회귀를 막습니다.",
			"GitOps와 Helm 기반 Kubernetes 운영 흐름까지 고려합니다.",
			"출시 후 운영과 확장까지 고려한 구조로 끝까지 책임집니다.",
		],
	},
} satisfies ProposalPageData;
