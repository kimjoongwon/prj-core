// ============================================================================
// Inquiry Domain - 문의 도메인 시드 데이터
// ============================================================================
//
// 옴니채널 고객 문의 관리 시스템의 현실적인 시드 데이터입니다.
// 다양한 상태, 카테고리, 채널을 포함하여 테스트 시나리오를 커버합니다.
// 각 배열은 `inquiryNumber`, `threadIndex`, `userEmail` 같은 business key로 서로 연결됩니다.
//
// ============================================================================

import { resolveSystemAdminSeedData } from "../bootstrap/data/system-users";
import type {
	InquiryCategory,
	InquiryChannel,
	InquiryParticipantRole,
	InquiryPriority,
	InquirySource,
	InquiryStatus,
	MessageContentType,
	SenderType,
	SentimentType,
	ThreadStatus,
} from "../generated/client/enums";

// ============================================================================
// Interfaces - 문의 도메인 시드 데이터 인터페이스
// ============================================================================

/**
 * 문의 시드 데이터 인터페이스
 */
export interface InquirySeedData {
	inquiryNumber: string;
	title: string;
	category: InquiryCategory;
	channel: InquiryChannel;
	source: InquirySource;
	status: InquiryStatus;
	priority: InquiryPriority;
	fitnessCenterName: string;
	customerEmail: string;
	assigneeEmail?: string;
	sentiment?: SentimentType;
	sentimentScore?: number;
	aiResolutionAttempted?: boolean;
	aiResolved?: boolean;
	isRealtimeChat?: boolean;
	tags: string[];
}

/**
 * 문의 스레드 시드 데이터 인터페이스
 */
export interface InquiryThreadSeedData {
	inquiryNumber: string;
	title?: string;
	status: ThreadStatus;
	createdByEmail: string;
}

/**
 * 문의 메시지 시드 데이터 인터페이스
 */
export interface InquiryMessageSeedData {
	inquiryNumber: string;
	threadIndex: number;
	senderEmail?: string;
	senderType: SenderType;
	content: string;
	contentType: MessageContentType;
	isEdited?: boolean;
}

/**
 * 문의 참여자 시드 데이터 인터페이스
 */
export interface InquiryParticipantSeedData {
	inquiryNumber: string;
	threadIndex?: number;
	userEmail: string;
	role: InquiryParticipantRole;
	isOnline?: boolean;
}

/**
 * 문의 태그 마스터 데이터 인터페이스
 */
export interface InquiryTagMasterSeedData {
	name: string;
	color: string;
}

/**
 * 감정 분석 시드 데이터 인터페이스
 */
export interface SentimentAnalysisSeedData {
	inquiryNumber: string;
	sentiment: SentimentType;
	score: number;
	confidence: number;
	emotions?: Record<string, number>;
	keywords?: string[];
	urgency?: number;
}

// ============================================================================
// Inquiry Tag Master Data - 태그 마스터 데이터
// ============================================================================

export const inquiryTagMasterData: InquiryTagMasterSeedData[] = [
	{ name: "VIP", color: "#FFD700" },
	{ name: "긴급", color: "#FF4444" },
	{ name: "배송지연", color: "#FF8C00" },
	{ name: "환불요청", color: "#9932CC" },
	{ name: "기술문의", color: "#4169E1" },
	{ name: "계정문제", color: "#32CD32" },
	{ name: "예약오류", color: "#DC143C" },
	{ name: "상품불량", color: "#8B0000" },
	{ name: "재문의", color: "#00CED1" },
	{ name: "AI해결", color: "#9370DB" },
	{ name: "에스컬레이션", color: "#FF1493" },
	{ name: "고객만족", color: "#228B22" },
];

// ============================================================================
// Inquiry Seed Data - 문의 시드 데이터 (10개)
// ============================================================================

export const inquirySeedData: InquirySeedData[] = [
	// 1. NEW 상태 - 신규 문의 (미배정)
	{
		inquiryNumber: "INQ-2026-0001",
		title: "배송 언제 되나요?",
		category: "DELIVERY",
		channel: "WEB",
		source: "ONLINE",
		status: "NEW",
		priority: "NORMAL",
		fitnessCenterName: "F45 광화문",
		customerEmail: "minsu.kim92@gmail.com",
		tags: ["배송지연"],
	},

	// 2. OPEN 상태 - 배정됨
	{
		inquiryNumber: "INQ-2026-0002",
		title: "예약이 두 번 생성됐어요",
		category: "TECHNICAL",
		channel: "CHAT",
		source: "ONLINE",
		status: "OPEN",
		priority: "HIGH",
		fitnessCenterName: "F45 강남1호",
		customerEmail: "seoyeon_lee@naver.com",
		assigneeEmail: "manager.gangnam@f45.kr",
		sentiment: "NEGATIVE",
		sentimentScore: -0.6,
		isRealtimeChat: true,
		tags: ["예약오류", "긴급"],
	},

	// 3. IN_PROGRESS 상태 - 처리 중
	{
		inquiryNumber: "INQ-2026-0003",
		title: "회원권 환불하고 싶습니다",
		category: "REFUND",
		channel: "EMAIL",
		source: "ONLINE",
		status: "IN_PROGRESS",
		priority: "NORMAL",
		fitnessCenterName: "크로스핏 이태원",
		customerEmail: "yejun.park@kakao.com",
		assigneeEmail: "manager.itaewon@crossfit.kr",
		sentiment: "NEGATIVE",
		sentimentScore: -0.4,
		tags: ["환불요청", "VIP"],
	},

	// 4. IN_PROGRESS 상태 - 처리 중 (AI 시도)
	{
		inquiryNumber: "INQ-2026-0004",
		title: "PT 프로그램 변경 문의드려요",
		category: "PRODUCT",
		channel: "WEB",
		source: "ONLINE",
		status: "IN_PROGRESS",
		priority: "NORMAL",
		fitnessCenterName: "F45 광화문",
		customerEmail: "jiwoo0315@gmail.com",
		assigneeEmail: "manager.gwanghwamun@f45.kr",
		aiResolutionAttempted: true,
		tags: ["기술문의"],
	},

	// 5. WAITING_CUSTOMER 상태 - 고객 응답 대기
	{
		inquiryNumber: "INQ-2026-0005",
		title: "앱 로그인이 안 돼요",
		category: "TECHNICAL",
		channel: "CHAT",
		source: "ONLINE",
		status: "WAITING_CUSTOMER",
		priority: "HIGH",
		fitnessCenterName: "애니타임피트니스 역삼",
		customerEmail: "hayoon.jung@naver.com",
		assigneeEmail: "manager.gangnam@f45.kr",
		sentiment: "NEGATIVE",
		sentimentScore: -0.3,
		isRealtimeChat: true,
		tags: ["기술문의", "계정문제"],
	},

	// 6. WAITING_CUSTOMER 상태 - 고객 응답 대기
	{
		inquiryNumber: "INQ-2026-0006",
		title: "회원 정보 수정 부탁드립니다",
		category: "ACCOUNT",
		channel: "WEB",
		source: "ONLINE",
		status: "WAITING_CUSTOMER",
		priority: "LOW",
		fitnessCenterName: "스포애니 홍대",
		customerEmail: "doyoon.kang@gmail.com",
		assigneeEmail: "manager.itaewon@crossfit.kr",
		tags: ["계정문제"],
	},

	// 7. RESOLVED 상태 - 해결됨 (AI 자동 해결)
	{
		inquiryNumber: "INQ-2026-0007",
		title: "영업시간이 어떻게 되나요?",
		category: "GENERAL",
		channel: "CHAT",
		source: "ONLINE",
		status: "RESOLVED",
		priority: "LOW",
		fitnessCenterName: "F45 삼성",
		customerEmail: "minsu.kim92@gmail.com",
		assigneeEmail: "manager.gangnam@f45.kr",
		sentiment: "POSITIVE",
		sentimentScore: 0.7,
		aiResolutionAttempted: true,
		aiResolved: true,
		isRealtimeChat: true,
		tags: ["AI해결", "고객만족"],
	},

	// 8. RESOLVED 상태 - 해결됨
	{
		inquiryNumber: "INQ-2026-0008",
		title: "운동복 주문했는데 사이즈가 안 맞아요",
		category: "PRODUCT",
		channel: "EMAIL",
		source: "ONLINE",
		status: "RESOLVED",
		priority: "NORMAL",
		fitnessCenterName: "애니타임피트니스 신논현",
		customerEmail: "seoyeon_lee@naver.com",
		assigneeEmail: "manager.gwanghwamun@f45.kr",
		sentiment: "NEUTRAL",
		sentimentScore: 0.1,
		tags: ["상품불량"],
	},

	// 9. CLOSED 상태 - 종료됨
	{
		inquiryNumber: "INQ-2026-0009",
		title: "PT 선생님 변경하고 싶어요",
		category: "PRODUCT",
		channel: "WEB",
		source: "ONLINE",
		status: "CLOSED",
		priority: "NORMAL",
		fitnessCenterName: "크로스핏 마포",
		customerEmail: "yejun.park@kakao.com",
		assigneeEmail: "manager.itaewon@crossfit.kr",
		sentiment: "NEUTRAL",
		sentimentScore: 0.0,
		tags: ["재문의"],
	},

	// 10. CLOSED 상태 - 종료됨 (긴급)
	{
		inquiryNumber: "INQ-2026-0010",
		title: "시설 이용 중 부상 관련 문의",
		category: "COMPLAINT",
		channel: "PHONE",
		source: "OFFLINE",
		status: "CLOSED",
		priority: "URGENT",
		fitnessCenterName: "스포애니 건대",
		customerEmail: "jiwoo0315@gmail.com",
		assigneeEmail: "manager.itaewon@crossfit.kr",
		sentiment: "NEGATIVE",
		sentimentScore: -0.8,
		tags: ["긴급", "에스컬레이션", "VIP"],
	},
];

// ============================================================================
// InquiryThread Seed Data - 문의 스레드 시드 데이터 (각 문의당 1개)
// ============================================================================

export const inquiryThreadSeedData: InquiryThreadSeedData[] = [
	// INQ-2026-0001 스레드
	{
		inquiryNumber: "INQ-2026-0001",
		title: "배송 관련 문의",
		status: "ACTIVE",
		createdByEmail: "minsu.kim92@gmail.com",
	},

	// INQ-2026-0002 스레드
	{
		inquiryNumber: "INQ-2026-0002",
		title: "중복 예약 취소 요청",
		status: "ACTIVE",
		createdByEmail: "seoyeon_lee@naver.com",
	},

	// INQ-2026-0003 스레드
	{
		inquiryNumber: "INQ-2026-0003",
		title: "회원권 환불 처리",
		status: "ACTIVE",
		createdByEmail: "yejun.park@kakao.com",
	},

	// INQ-2026-0004 스레드
	{
		inquiryNumber: "INQ-2026-0004",
		title: "PT 프로그램 변경 상담",
		status: "ACTIVE",
		createdByEmail: "jiwoo0315@gmail.com",
	},

	// INQ-2026-0005 스레드
	{
		inquiryNumber: "INQ-2026-0005",
		title: "로그인 오류 해결",
		status: "ACTIVE",
		createdByEmail: "hayoon.jung@naver.com",
	},

	// INQ-2026-0006 스레드
	{
		inquiryNumber: "INQ-2026-0006",
		title: "회원 정보 수정 요청",
		status: "ACTIVE",
		createdByEmail: "doyoon.kang@gmail.com",
	},

	// INQ-2026-0007 스레드
	{
		inquiryNumber: "INQ-2026-0007",
		title: "영업시간 안내",
		status: "RESOLVED",
		createdByEmail: "minsu.kim92@gmail.com",
	},

	// INQ-2026-0008 스레드
	{
		inquiryNumber: "INQ-2026-0008",
		title: "운동복 교환/반품",
		status: "RESOLVED",
		createdByEmail: "seoyeon_lee@naver.com",
	},

	// INQ-2026-0009 스레드
	{
		inquiryNumber: "INQ-2026-0009",
		title: "PT 강사 변경 요청",
		status: "CLOSED",
		createdByEmail: "yejun.park@kakao.com",
	},

	// INQ-2026-0010 스레드
	{
		inquiryNumber: "INQ-2026-0010",
		title: "시설 이용 중 부상 관련",
		status: "CLOSED",
		createdByEmail: "jiwoo0315@gmail.com",
	},
];

// ============================================================================
// InquiryMessage Seed Data - 문의 메시지 시드 데이터
// ============================================================================

export const inquiryMessageSeedData: InquiryMessageSeedData[] = [
	// INQ-2026-0001: 배송 문의 (4개 메시지)
	{
		inquiryNumber: "INQ-2026-0001",
		threadIndex: 0,
		senderEmail: "minsu.kim92@gmail.com",
		senderType: "USER",
		content:
			"안녕하세요, 주문한 운동용품이 언제 도착하나요? 3일 전에 주문했는데 아직 배송 정보가 없어서요.",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0001",
		threadIndex: 0,
		senderType: "AI",
		content:
			"안녕하세요! 주문 번호를 알려주시면 배송 현황을 확인해 드리겠습니다. 보통 평일 기준 2-3일 소요됩니다.",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0001",
		threadIndex: 0,
		senderEmail: "minsu.kim92@gmail.com",
		senderType: "USER",
		content: "주문번호는 ORD-2026-0215입니다.",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0001",
		threadIndex: 0,
		senderType: "SYSTEM",
		content: "상담원이 배정되었습니다. 잠시만 기다려주세요.",
		contentType: "SYSTEM",
	},

	// INQ-2026-0002: 예약 오류 (5개 메시지)
	{
		inquiryNumber: "INQ-2026-0002",
		threadIndex: 0,
		senderEmail: "seoyeon_lee@naver.com",
		senderType: "USER",
		content:
			"예약이 두 번 생성됐어요! 하나는 바로 취소해주세요. 이런 일이 어떻게 생길 수 있죠?",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0002",
		threadIndex: 0,
		senderType: "SYSTEM",
		content: "상담원(박매니저)이 입장했습니다.",
		contentType: "SYSTEM",
	},
	{
		inquiryNumber: "INQ-2026-0002",
		threadIndex: 0,
		senderEmail: "manager.gangnam@f45.kr",
		senderType: "USER",
		content:
			"서연님, 불편을 드려 죄송합니다. 예약 내역을 확인 중입니다. 예약 시간을 알려주시겠어요?",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0002",
		threadIndex: 0,
		senderEmail: "seoyeon_lee@naver.com",
		senderType: "USER",
		content: "오늘 오후 2시 30분경 예약했습니다. 같은 시간이 두 번 잡혔어요.",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0002",
		threadIndex: 0,
		senderEmail: "manager.gangnam@f45.kr",
		senderType: "USER",
		content:
			"확인했습니다. 시스템 오류로 중복 예약이 발생했습니다. 1건은 오늘 중으로 취소 처리해드리겠습니다. 정말 죄송합니다.",
		contentType: "TEXT",
	},

	// INQ-2026-0003: 환불 요청 (4개 메시지)
	{
		inquiryNumber: "INQ-2026-0003",
		threadIndex: 0,
		senderEmail: "yejun.park@kakao.com",
		senderType: "USER",
		content:
			"안녕하세요, 개인 사정으로 인해 회원권 환불을 요청합니다. 3개월 회원권인데 1달밖에 사용하지 않았습니다.",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0003",
		threadIndex: 0,
		senderEmail: "manager.itaewon@crossfit.kr",
		senderType: "USER",
		content:
			"예준님, 문의해주셔서 감사합니다. 환불 규정에 따라 사용 기간을 제외한 금액에서 10% 수수료를 공제하여 환불해드립니다. 환불 계좌번호를 알려주시겠어요?",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0003",
		threadIndex: 0,
		senderEmail: "yejun.park@kakao.com",
		senderType: "USER",
		content:
			"네, 카카오뱅크 3333-02-1234567 예금주 박예준입니다. 환불 금액이 얼마인가요?",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0003",
		threadIndex: 0,
		senderEmail: "manager.itaewon@crossfit.kr",
		senderType: "USER",
		content:
			"전체 이용 기간 중, 1개월 사용분과 수수료를 제외한 금액을 3영업일 내에 안내해드리겠습니다.",
		contentType: "TEXT",
	},

	// INQ-2026-0004: PT 프로그램 변경 (3개 메시지)
	{
		inquiryNumber: "INQ-2026-0004",
		threadIndex: 0,
		senderEmail: "jiwoo0315@gmail.com",
		senderType: "USER",
		content:
			"현재 받고 있는 PT 프로그램을 다른 것으로 변경하고 싶습니다. 근력 강화 위주로 바꿀 수 있을까요?",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0004",
		threadIndex: 0,
		senderType: "AI",
		content:
			"지우님, PT 프로그램 변경이 가능합니다. 근력 강화 프로그램은 주 3회 기준으로 구성되어 있으며, 담당 트레이너와 상담 후 변경 가능합니다.",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0004",
		threadIndex: 0,
		senderEmail: "manager.gwanghwamun@f45.kr",
		senderType: "USER",
		content:
			"네, 근력 강화 프로그램으로 변경 가능합니다. 이번 주 토요일 오전 10시에 상담 가능하실까요?",
		contentType: "TEXT",
	},

	// INQ-2026-0005: 로그인 오류 (4개 메시지)
	{
		inquiryNumber: "INQ-2026-0005",
		threadIndex: 0,
		senderEmail: "hayoon.jung@naver.com",
		senderType: "USER",
		content:
			"앱에 로그인이 안 돼요. 비밀번호를 분실한 것 같은데 재설정 메일도 안 와요.",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0005",
		threadIndex: 0,
		senderEmail: "manager.gangnam@f45.kr",
		senderType: "USER",
		content:
			"하윤님, 가입하신 이메일 주소를 확인해주세요. 스팸 메일함에 들어갔을 수도 있습니다.",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0005",
		threadIndex: 0,
		senderEmail: "hayoon.jung@naver.com",
		senderType: "USER",
		content:
			"스팸함도 확인했는데 없어요. 제 이메일은 hayoon.jung@naver.com입니다.",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0005",
		threadIndex: 0,
		senderEmail: "manager.gangnam@f45.kr",
		senderType: "USER",
		content:
			"이메일 확인했습니다. 가입된 계정이네요. 비밀번호 재설정 링크를 다시 보내드렸습니다. 확인 부탁드립니다.",
		contentType: "TEXT",
	},

	// INQ-2026-0006: 회원 정보 수정 (3개 메시지)
	{
		inquiryNumber: "INQ-2026-0006",
		threadIndex: 0,
		senderEmail: "doyoon.kang@gmail.com",
		senderType: "USER",
		content:
			"회원 정보에 전화번호가 잘못 등록되어 있습니다. 올바른 번호로 수정 부탁드립니다.",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0006",
		threadIndex: 0,
		senderEmail: "manager.itaewon@crossfit.kr",
		senderType: "USER",
		content:
			"도윤님, 변경하실 전화번호와 본인 확인을 위해 현재 등록된 전화번호를 알려주시겠어요?",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0006",
		threadIndex: 0,
		senderEmail: "doyoon.kang@gmail.com",
		senderType: "USER",
		content:
			"현재 010-0000-0000으로 되어 있고, 010-9876-5432로 변경 부탁드립니다.",
		contentType: "TEXT",
	},

	// INQ-2026-0007: 영업시간 문의 (AI 해결, 2개 메시지)
	{
		inquiryNumber: "INQ-2026-0007",
		threadIndex: 0,
		senderEmail: "minsu.kim92@gmail.com",
		senderType: "USER",
		content: "F45 삼성점 영업시간이 어떻게 되나요?",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0007",
		threadIndex: 0,
		senderType: "AI",
		content:
			"F45 삼성점 영업시간 안내해 드립니다.\n\n평일: 오전 6시 ~ 오후 10시\n토요일: 오전 7시 ~ 오후 8시\n일요일 및 공휴일: 오전 8시 ~ 오후 6시\n\n더 궁금한 점이 있으시면 언제든 문의해주세요!",
		contentType: "TEXT",
	},

	// INQ-2026-0008: 상품 교환 (4개 메시지)
	{
		inquiryNumber: "INQ-2026-0008",
		threadIndex: 0,
		senderEmail: "seoyeon_lee@naver.com",
		senderType: "USER",
		content:
			"주문한 운동복이 사이즈가 너무 작아요. L 사이즈로 교환 가능한가요?",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0008",
		threadIndex: 0,
		senderEmail: "manager.gwanghwamun@f45.kr",
		senderType: "USER",
		content:
			"서연님, 교환 가능합니다. 상품을 미개봉 상태로 보내주시면 L 사이즈로 교환해드리겠습니다. 반송 주소를 보내드릴까요?",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0008",
		threadIndex: 0,
		senderEmail: "seoyeon_lee@naver.com",
		senderType: "USER",
		content: "네, 반송 주소 부탁드립니다. 택배비는 어떻게 되나요?",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0008",
		threadIndex: 0,
		senderEmail: "manager.gwanghwamun@f45.kr",
		senderType: "USER",
		content:
			"반송 주소: 서울시 종로구 세종대로 175 광화문D타워 B1 F45 광화문\n택배비는 착불로 보내주시면 됩니다. 교환 상품은 무료로 발송해드립니다.",
		contentType: "TEXT",
	},

	// INQ-2026-0009: PT 강사 변경 (3개 메시지)
	{
		inquiryNumber: "INQ-2026-0009",
		threadIndex: 0,
		senderEmail: "yejun.park@kakao.com",
		senderType: "USER",
		content: "담당 PT 선생님을 변경하고 싶습니다. 스케줄이 안 맞아서요.",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0009",
		threadIndex: 0,
		senderEmail: "manager.itaewon@crossfit.kr",
		senderType: "USER",
		content:
			"예준님, 원하시는 시간대와 선호하시는 트레이닝 스타일을 알려주시면 맞는 트레이너를 배정해드리겠습니다.",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0009",
		threadIndex: 0,
		senderEmail: "yejun.park@kakao.com",
		senderType: "USER",
		content: "평일 저녁 7시 이후로 가능하고, 크로스핏 스타일을 선호합니다.",
		contentType: "TEXT",
	},

	// INQ-2026-0010: 부상 관련 (5개 메시지, 긴급)
	{
		inquiryNumber: "INQ-2026-0010",
		threadIndex: 0,
		senderEmail: "jiwoo0315@gmail.com",
		senderType: "USER",
		content:
			"지난주 시설 이용 중 기구에서 넘어져서 발목을 다쳤습니다. 병원비 보상이 되나요?",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0010",
		threadIndex: 0,
		senderType: "SYSTEM",
		content:
			"[긴급] 이 문의는 에스컬레이션 처리되었습니다. 매니저가 즉시 확인합니다.",
		contentType: "SYSTEM",
	},
	{
		inquiryNumber: "INQ-2026-0010",
		threadIndex: 0,
		senderEmail: "manager.itaewon@crossfit.kr",
		senderType: "USER",
		content:
			"지우님, 많이 놀라셨겠습니다. 현재 상태는 어떠신가요? 병원 진료를 받으셨나요?",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0010",
		threadIndex: 0,
		senderEmail: "jiwoo0315@gmail.com",
		senderType: "USER",
		content:
			"네, 인근 정형외과에서 진료받았습니다. 진단서와 병원비 영수증이 있습니다.",
		contentType: "TEXT",
	},
	{
		inquiryNumber: "INQ-2026-0010",
		threadIndex: 0,
		senderEmail: "manager.itaewon@crossfit.kr",
		senderType: "USER",
		content:
			"진단서와 영수증을 센터로 가져오시면 보험 처리 도와드리겠습니다. 회원님의 안전이 최우선입니다. 빠른 회복 기원합니다.",
		contentType: "TEXT",
	},
];

// ============================================================================
// InquiryParticipant Seed Data - 문의 참여자 시드 데이터
// ============================================================================

export const inquiryParticipantSeedData: InquiryParticipantSeedData[] = [
	// INQ-2026-0001: 배송 문의
	{
		inquiryNumber: "INQ-2026-0001",
		threadIndex: 0,
		userEmail: "minsu.kim92@gmail.com",
		role: "CUSTOMER",
		isOnline: true,
	},

	// INQ-2026-0002: 예약 오류
	{
		inquiryNumber: "INQ-2026-0002",
		threadIndex: 0,
		userEmail: "seoyeon_lee@naver.com",
		role: "CUSTOMER",
		isOnline: true,
	},
	{
		inquiryNumber: "INQ-2026-0002",
		threadIndex: 0,
		userEmail: "manager.gangnam@f45.kr",
		role: "AGENT",
		isOnline: true,
	},

	// INQ-2026-0003: 환불 요청
	{
		inquiryNumber: "INQ-2026-0003",
		threadIndex: 0,
		userEmail: "yejun.park@kakao.com",
		role: "CUSTOMER",
		isOnline: false,
	},
	{
		inquiryNumber: "INQ-2026-0003",
		threadIndex: 0,
		userEmail: "manager.itaewon@crossfit.kr",
		role: "AGENT",
		isOnline: true,
	},

	// INQ-2026-0004: PT 프로그램 변경
	{
		inquiryNumber: "INQ-2026-0004",
		threadIndex: 0,
		userEmail: "jiwoo0315@gmail.com",
		role: "CUSTOMER",
		isOnline: true,
	},
	{
		inquiryNumber: "INQ-2026-0004",
		threadIndex: 0,
		userEmail: "manager.gwanghwamun@f45.kr",
		role: "AGENT",
		isOnline: true,
	},

	// INQ-2026-0005: 로그인 오류
	{
		inquiryNumber: "INQ-2026-0005",
		threadIndex: 0,
		userEmail: "hayoon.jung@naver.com",
		role: "CUSTOMER",
		isOnline: true,
	},
	{
		inquiryNumber: "INQ-2026-0005",
		threadIndex: 0,
		userEmail: "manager.gangnam@f45.kr",
		role: "AGENT",
		isOnline: true,
	},

	// INQ-2026-0006: 회원 정보 수정
	{
		inquiryNumber: "INQ-2026-0006",
		threadIndex: 0,
		userEmail: "doyoon.kang@gmail.com",
		role: "CUSTOMER",
		isOnline: false,
	},
	{
		inquiryNumber: "INQ-2026-0006",
		threadIndex: 0,
		userEmail: "manager.itaewon@crossfit.kr",
		role: "AGENT",
		isOnline: false,
	},

	// INQ-2026-0007: 영업시간 문의
	{
		inquiryNumber: "INQ-2026-0007",
		threadIndex: 0,
		userEmail: "minsu.kim92@gmail.com",
		role: "CUSTOMER",
		isOnline: false,
	},

	// INQ-2026-0008: 상품 교환
	{
		inquiryNumber: "INQ-2026-0008",
		threadIndex: 0,
		userEmail: "seoyeon_lee@naver.com",
		role: "CUSTOMER",
		isOnline: false,
	},
	{
		inquiryNumber: "INQ-2026-0008",
		threadIndex: 0,
		userEmail: "manager.gwanghwamun@f45.kr",
		role: "AGENT",
		isOnline: false,
	},

	// INQ-2026-0009: PT 강사 변경
	{
		inquiryNumber: "INQ-2026-0009",
		threadIndex: 0,
		userEmail: "yejun.park@kakao.com",
		role: "CUSTOMER",
		isOnline: false,
	},
	{
		inquiryNumber: "INQ-2026-0009",
		threadIndex: 0,
		userEmail: "manager.itaewon@crossfit.kr",
		role: "AGENT",
		isOnline: false,
	},

	// INQ-2026-0010: 부상 관련
	{
		inquiryNumber: "INQ-2026-0010",
		threadIndex: 0,
		userEmail: "jiwoo0315@gmail.com",
		role: "CUSTOMER",
		isOnline: false,
	},
	{
		inquiryNumber: "INQ-2026-0010",
		threadIndex: 0,
		userEmail: "manager.itaewon@crossfit.kr",
		role: "AGENT",
		isOnline: false,
	},
	{
		inquiryNumber: "INQ-2026-0010",
		userEmail: resolveSystemAdminSeedData()[0].email,
		role: "SUPERVISOR",
		isOnline: false,
	},
];

// ============================================================================
// SentimentAnalysis Seed Data - 감정 분석 시드 데이터 (일부만)
// ============================================================================

export const sentimentAnalysisSeedData: SentimentAnalysisSeedData[] = [
	// INQ-2026-0002: 예약 오류 (부정)
	{
		inquiryNumber: "INQ-2026-0002",
		sentiment: "NEGATIVE",
		score: -0.6,
		confidence: 0.89,
		emotions: {
			anger: 0.45,
			frustration: 0.35,
			anxiety: 0.2,
		},
		keywords: ["두 번", "환불", "어떻게"],
		urgency: 0.75,
	},

	// INQ-2026-0003: 환불 요청 (부정)
	{
		inquiryNumber: "INQ-2026-0003",
		sentiment: "NEGATIVE",
		score: -0.4,
		confidence: 0.82,
		emotions: {
			disappointment: 0.4,
			neutrality: 0.35,
			resignation: 0.25,
		},
		keywords: ["개인 사정", "환불", "요청"],
		urgency: 0.45,
	},

	// INQ-2026-0005: 로그인 오류 (부정)
	{
		inquiryNumber: "INQ-2026-0005",
		sentiment: "NEGATIVE",
		score: -0.3,
		confidence: 0.76,
		emotions: {
			frustration: 0.5,
			confusion: 0.3,
			helplessness: 0.2,
		},
		keywords: ["안 돼요", "분실", "안 와요"],
		urgency: 0.55,
	},

	// INQ-2026-0007: 영업시간 문의 (긍정)
	{
		inquiryNumber: "INQ-2026-0007",
		sentiment: "POSITIVE",
		score: 0.7,
		confidence: 0.91,
		emotions: {
			curiosity: 0.6,
			neutrality: 0.3,
			anticipation: 0.1,
		},
		keywords: ["영업시간", "어떻게"],
		urgency: 0.15,
	},

	// INQ-2026-0008: 상품 교환 (중립)
	{
		inquiryNumber: "INQ-2026-0008",
		sentiment: "NEUTRAL",
		score: 0.1,
		confidence: 0.85,
		emotions: {
			neutrality: 0.7,
			slight_frustration: 0.2,
			hope: 0.1,
		},
		keywords: ["사이즈", "너무 작아요", "교환"],
		urgency: 0.35,
	},

	// INQ-2026-0010: 부상 관련 (매우 부정)
	{
		inquiryNumber: "INQ-2026-0010",
		sentiment: "NEGATIVE",
		score: -0.8,
		confidence: 0.94,
		emotions: {
			pain: 0.4,
			anxiety: 0.35,
			anger: 0.15,
			concern: 0.1,
		},
		keywords: ["넘어져서", "다쳤습니다", "보상"],
		urgency: 0.95,
	},
];
