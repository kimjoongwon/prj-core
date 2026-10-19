export type TechStackItem = {
	name: string;
	role: string;
	demoNote: string | null;
};

export type TechStackGroup = {
	id: string;
	title: string;
	summary: string;
	items: TechStackItem[];
};

/**
 * 클라이언트 시연용 기술 스택 소개 데이터.
 * 데모가 목업으로 흉내 낸 지점(demoNote)과 실제 구현 스택을 함께 표기해
 * "이 데모 → 실제 서비스" 연결 스토리로 사용한다.
 */
export const techStackGroups: TechStackGroup[] = [
	{
		id: "frontend",
		title: "프론트엔드",
		summary: "반응형 시청 레이아웃 · 플레이어 · 실시간 채팅 · 무중단 결제 UX",
		items: [
			{
				name: "Next.js (App Router) + TypeScript",
				role: "시청자·관리자 웹 애플리케이션, 서버 렌더링과 반응형 레이아웃",
				demoNote: "이 데모도 동일 구조(Next.js)로 만들었습니다",
			},
			{
				name: "Tailwind CSS v4 + HeroUI 디자인 시스템",
				role: "라이브 쇼핑에 맞은 다크 테마 UI, 모바일/데스크톱 일관 디자인",
				demoNote: "이 데모 화면이 그대로 스타일 참고본입니다",
			},
			{
				name: "MobX 상태 관리",
				role: "채팅·재고·구매 흐름 같은 실시간 화면 상태 관리",
				demoNote: "데모의 재고 게이지·채팅도 같은 패턴으로 동작합니다",
			},
			{
				name: "스트리밍 플레이어",
				role: "Amazon IVS Player Web SDK — 저지연 라이브 재생 (자체 호스팅 시 OvenPlayer/hls.js로 동일 교체)",
				demoNote:
					"데모는 로컬 루프 영상 + SDK 교체 지점을 코드에 마련해 두었습니다",
			},
			{
				name: "실시간 채팅",
				role: "IVS Chat Client SDK 또는 자체 WebSocket — 채팅·구매·쿠폰 이벤트 처리",
				demoNote: "데모는 클라이언트 시뮬레이션이고 SDK 구독 구조로 교체합니다",
			},
		],
	},
	{
		id: "backend",
		title: "백엔드 · 데이터",
		summary: "카카오 로그인 · 커머스/결제 · 실시간 재고 · 알림톡 큐",
		items: [
			{
				name: "NestJS",
				role: "모듈형 API 서버 — 인증·방송·상품·주문·관리자 도메인 분리",
				demoNote: "데모는 Next.js API 라우트로 같은 계약을 목업했습니다",
			},
			{
				name: "카카오 OAuth 2.0 + JWT",
				role: "간편 가입/로그인 후 서비스 액세스 토큰 발급·검증",
				demoNote:
					"데모는 동의 화면 목업 → 실제 HS256 JWT 서명·쿠키 발급까지 구현했습니다",
			},
			{
				name: "PostgreSQL + Prisma",
				role: "주문·상품·재고 트랜잭션 — 재고 부족 시 주문 거절(409)",
				demoNote: "데모의 '재고 부족' 409 응답이 같은 규칙입니다",
			},
			{
				name: "Redis + BullMQ 백그라운드 큐",
				role: "알림톡 발송 작업 큐 — 주문 확정 후 비동기 발송, 실패 재시도",
				demoNote:
					"데모는 '큐 대기 → 발송 완료' 전환을 4초 지연으로 흉내 냈습니다",
			},
			{
				name: "PG 결제 연동",
				role: "PG사 승인 → 재고 차감 → 주문 확정 트랜잭션 (채약 PG사에 맞춰 연동)",
				demoNote: "데모는 카카오페이/카드 목업 PG 화면입니다",
			},
		],
	},
	{
		id: "infra",
		title: "인프라 · 운영",
		summary: "무중단 배포와 빌드·배포 자동화",
		items: [
			{
				name: "Docker + Kubernetes (ArgoCD)",
				role: "컨테이너 이미지 배포, 롤링 업데이트 무중단 운영",
				demoNote: null,
			},
			{
				name: "Jenkins CI/CD",
				role: "커밋→빌드→이미지 태그→배포 파이프라인 자동화",
				demoNote: null,
			},
			{
				name: "관리자 콘솔",
				role: "방송·상품·주문·알림톡 운영 화면 (권한 기반 접근)",
				demoNote: "데모의 관리자 화면과 같은 구조입니다",
			},
		],
	},
];

export type StreamingOption = {
	id: string;
	title: string;
	tagline: string;
	highlights: string[];
	costShape: string;
};

export const streamingOptions: StreamingOption[] = [
	{
		id: "managed-ivs",
		title: "옵션 A · 관리형 (Amazon IVS)",
		tagline: "운영 부담 최소 — 채널 생성·저지연 스트리밍·재생 보안이 내장",
		highlights: [
			"채널 관리·녹화·비공개 채널(서명 재생 토큰) 기본 제공",
			"WebRTC/저지연 HLS로 수 초 이내 지연",
			"규모 확장을 AWS가 처리 — 서버 운영 불필요",
		],
		costShape:
			"시청 규모에 비례 과금 · 한국 리전 HD 약 $0.125/시청자시간 + 송출 시간당 입력 요금",
	},
	{
		id: "self-hosted",
		title: "옵션 B · 오픈소스 자체 호스팅",
		tagline: "트래픽 단가 직접 통제 — 미디어 서버를 직접 운영",
		highlights: [
			"OvenMediaEngine(초저지연, 상용 라이선스 별매) · SRS/MediaMTX(MIT 라이선스)",
			"CDN·서버 사양을 직접 조합해 단가 관리 (비트레이트 조절로 비용 절감)",
			"재생 보안은 CDN 서명 URL·시청 토큰으로 동일하게 구현",
		],
		costShape:
			"서버 임대 + 인터넷 송신 트래픽(GB당) 과금 · 규모가 커질수록 유리해지는 구조",
	},
];

export type RequirementMappingRow = {
	requirement: string;
	demo: string;
	production: string;
};

export const requirementMappingRows: RequirementMappingRow[] = [
	{
		requirement: "카카오 로그인 연동 (OAuth 2.0 + JWT)",
		demo: "목업 동의 화면 → 실제 HS256 JWT 서명·쿠키 발급",
		production: "카카오 OAuth 코드 흐름 + 서비스 토큰 발급",
	},
	{
		requirement: "AWS IVS 채널 관리 및 재생 보안",
		demo: "관리자 채널 카드 + 5분 만료 재생 토큰 자동 갱신",
		production: "IVS 채널 API·비공개 재생 (또는 자체 CDN 서명 URL)",
	},
	{
		requirement: "커머스 · 결제(PG) · 실시간 재고 제어",
		demo: "무중단 오버레이 결제, 재고 초과 시 409 거절",
		production: "PG 승인 + DB 트랜잭션 재고 차감",
	},
	{
		requirement: "알림톡 & 백그라운드 큐",
		demo: "주문 즉시 큐 적재 → 수 초 뒤 발송 완료 전환",
		production: "BullMQ 작업 큐 + 알림톡 발송 API",
	},
	{
		requirement: "관리자 페이지 구축",
		demo: "대시보드·상품 재고·주문·알림톡 이력",
		production: "동일 구조 + 권한 기반 접근 제어",
	},
	{
		requirement: "반응형 시청 레이아웃 · 플레이어 · 채팅",
		demo: "모바일/데스크톱 전환, 목업 플레이어·채팅",
		production: "IVS Player/Chat SDK (또는 오픈소스 미디어 서버)",
	},
	{
		requirement: "방송 무중단(오버레이) 결제 UX",
		demo: "영상 재생 유지 위에 결제 시트 — 핵심 시연 포인트",
		production: "동일 UX + 실제 PG 승인 흐름",
	},
];

export const architectureFlowSteps: string[] = [
	"시청자 웹·모바일 (Next.js 반응형 레이아웃)",
	"스트리밍 엣지 — Amazon IVS 또는 자체 미디어 서버 + CDN (재생 토큰 인증)",
	"API 서버 (NestJS — 인증·주문·재고·방송 관리)",
	"데이터·큐 (PostgreSQL + Redis/BullMQ)",
	"외부 연동 (카카오 로그인 · PG사 · 알림톡)",
];
