import type { NavItemConfig, TabConfig, FABAction } from "@cocrepo/store";

/**
 * 어드민 메뉴 경로 상수
 *
 * 경로 설계 원칙:
 * 1. 백엔드 엔티티 이름의 복수형 사용 (User → /users)
 * 2. UI 구현 방식 단어 배제 (list, table, grid 금지)
 * 3. 경로는 "무엇이 있는 화면인가"를 추상적으로 표현
 */
export const ADMIN_PATHS = {
	// 대시보드
	DASHBOARD: "/dashboard",

	// 회원 (User 엔티티) - v7.0 명칭 변경: 사용자 → 회원
	USERS: "/users",
	USERS_ACTIVE: "/users/active",
	USERS_DORMANT: "/users/dormant",
	USERS_PENDING_WITHDRAWAL: "/users/pending-withdrawal",
	USERS_DETAIL: "/users/[id]",
	USERS_GRADES: "/users/grades",
	USERS_WITHDRAWN: "/users/withdrawn",

	// 예약 (Reservation 엔티티)
	RESERVATIONS: "/reservations",
	RESERVATIONS_TODAY: "/reservations/today",
	RESERVATIONS_PENDING: "/reservations/pending",
	RESERVATIONS_CONFIRMED: "/reservations/confirmed",
	RESERVATIONS_CANCELLED: "/reservations/cancelled",
	RESERVATIONS_CALENDAR: "/reservations/calendar",
	RESERVATIONS_STATS: "/reservations/stats",

	// 알림 (Notification 엔티티)
	NOTIFICATIONS_SEND: "/notifications/send",
	NOTIFICATIONS_HISTORY: "/notifications/history",
	NOTIFICATIONS_HISTORY_SMS: "/notifications/history/sms",
	NOTIFICATIONS_HISTORY_EMAIL: "/notifications/history/email",
	NOTIFICATIONS_HISTORY_PUSH: "/notifications/history/push",
	NOTIFICATIONS_TEMPLATES: "/notifications/templates",
	NOTIFICATIONS_SETTINGS: "/notifications/settings",

	// 문의 (Inquiry 엔티티)
	INQUIRIES: "/inquiries",
	INQUIRIES_PENDING: "/inquiries/pending",
	INQUIRIES_COMPLETED: "/inquiries/completed",
	INQUIRIES_DIRECT: "/inquiries/direct",
	INQUIRIES_ANSWERED: "/inquiries/answered",
	INQUIRIES_FAQ: "/inquiries/faq",

	// 콘텐츠
	NOTICES: "/notices",
	BANNERS: "/banners",
	EVENTS: "/events",
	EVENTS_ONGOING: "/events/ongoing",
	EVENTS_UPCOMING: "/events/upcoming",
	EVENTS_ENDED: "/events/ended",
	TERMS: "/terms",

	// 템플릿
	TEMPLATES_SMS: "/templates/sms",
	TEMPLATES_EMAIL: "/templates/email",
	TEMPLATES_PUSH: "/templates/push",
	TEMPLATES_HTML: "/templates/html",

	// 세션 (v7.0 신규)
	SESSIONS: "/sessions",
	SESSIONS_ONE_TIME: "/sessions/one-time",
	SESSIONS_RECURRING: "/sessions/recurring",
	SESSIONS_UPCOMING: "/sessions/upcoming",
	SESSIONS_PAST: "/sessions/past",
	SESSIONS_TIMELINES: "/sessions/timelines",
	SESSIONS_TIMELINES_ACTIVE: "/sessions/timelines/active",
	SESSIONS_TIMELINES_ARCHIVED: "/sessions/timelines/archived",
	SESSIONS_PROGRAMS: "/sessions/programs",
	SESSIONS_PROGRAMS_ACTIVE: "/sessions/programs/active",
	SESSIONS_PROGRAMS_FULL: "/sessions/programs/full",
	SESSIONS_PROGRAMS_AVAILABLE: "/sessions/programs/available",
	SESSIONS_ROUTINES: "/sessions/routines",
	SESSIONS_ROUTINES_EXERCISE: "/sessions/routines/exercise",

	// 시설 (v7.0 - 설정에서 분리)
	GROUNDS: "/grounds",
	GROUNDS_PROGRAMS: "/grounds/programs",
	GROUNDS_EQUIPMENT: "/grounds/equipment",

	// 관리자 (v7.0 - 설정에서 분리)
	ADMINS: "/admins",
	ADMINS_ACTIVE: "/admins/active",
	ADMINS_INACTIVE: "/admins/inactive",
	ADMINS_INVITATIONS: "/admins/invitations",
	ADMINS_INVITATIONS_PENDING: "/admins/invitations/pending",
	ADMINS_INVITATIONS_EXPIRED: "/admins/invitations/expired",

	// 역할/권한 (v7.0 - 설정에서 분리)
	ROLES: "/roles",
	ROLES_ABILITIES: "/roles/abilities",

	// 기타
	SELECT_SPACE: "/select-space",
	AUTH_LOGIN: "/auth/login",
} as const;

/**
 * 어드민 메뉴 Subject 상수
 *
 * Subject 네이밍 규칙:
 * - menu:{entity} - 1depth 메뉴
 * - menu:{entity}:{sub} - 2depth 메뉴
 */
export const ADMIN_SUBJECTS = {
	// 대시보드
	MENU_DASHBOARD: "menu:dashboard",

	// 1depth 메뉴
	MENU_USERS: "menu:users",
	MENU_RESERVATIONS: "menu:reservations",
	MENU_NOTIFICATIONS: "menu:notifications",
	MENU_INQUIRIES: "menu:inquiries",
	MENU_CONTENTS: "menu:contents",
	MENU_TEMPLATES: "menu:templates",
	MENU_SESSIONS: "menu:sessions",
	MENU_GROUNDS: "menu:grounds",
	MENU_ADMINS: "menu:admins",
	MENU_ROLES: "menu:roles",

	// 2depth - 회원
	MENU_USERS_LIST: "menu:users:list",
	MENU_USERS_GRADES: "menu:users:grades",
	MENU_USERS_WITHDRAWN: "menu:users:withdrawn",

	// 2depth - 예약
	MENU_RESERVATIONS_TODAY: "menu:reservations:today",
	MENU_RESERVATIONS_LIST: "menu:reservations:list",
	MENU_RESERVATIONS_CALENDAR: "menu:reservations:calendar",
	MENU_RESERVATIONS_STATS: "menu:reservations:stats",

	// 2depth - 알림
	MENU_NOTIFICATIONS_SEND: "menu:notifications:send",
	MENU_NOTIFICATIONS_HISTORY: "menu:notifications:history",
	MENU_NOTIFICATIONS_TEMPLATES: "menu:notifications:templates",
	MENU_NOTIFICATIONS_SETTINGS: "menu:notifications:settings",

	// 2depth - 문의
	MENU_INQUIRIES_LIST: "menu:inquiries:list",
	MENU_INQUIRIES_DIRECT: "menu:inquiries:direct",
	MENU_INQUIRIES_ANSWERED: "menu:inquiries:answered",
	MENU_INQUIRIES_FAQ: "menu:inquiries:faq",

	// 2depth - 콘텐츠
	MENU_CONTENTS_NOTICES: "menu:contents:notices",
	MENU_CONTENTS_BANNERS: "menu:contents:banners",
	MENU_CONTENTS_EVENTS: "menu:contents:events",
	MENU_CONTENTS_TERMS: "menu:contents:terms",

	// 2depth - 템플릿
	MENU_TEMPLATES_SMS: "menu:templates:sms",
	MENU_TEMPLATES_EMAIL: "menu:templates:email",
	MENU_TEMPLATES_PUSH: "menu:templates:push",
	MENU_TEMPLATES_HTML: "menu:templates:html",

	// 2depth - 세션 (v7.0 신규)
	MENU_SESSIONS_TIMELINES: "menu:sessions:timelines",
	MENU_SESSIONS_LIST: "menu:sessions:list",
	MENU_SESSIONS_PROGRAMS: "menu:sessions:programs",
	MENU_SESSIONS_ROUTINES: "menu:sessions:routines",

	// 2depth - 시설 (v7.0)
	MENU_GROUNDS_INFO: "menu:grounds:info",
	MENU_GROUNDS_PROGRAMS: "menu:grounds:programs",
	MENU_GROUNDS_EQUIPMENT: "menu:grounds:equipment",

	// 2depth - 관리자 (v7.0)
	MENU_ADMINS_LIST: "menu:admins:list",
	MENU_ADMINS_INVITATIONS: "menu:admins:invitations",

	// 2depth - 역할/권한 (v7.0)
	MENU_ROLES_LIST: "menu:roles:list",
	MENU_ROLES_ABILITIES: "menu:roles:abilities",

	// FAB 액션 (v7.0 신규)
	QUICK_ACTION_TODAY_RESERVATION: "quickAction:todayReservation",
	QUICK_ACTION_QUICK_RESERVATION: "quickAction:quickReservation",
	QUICK_ACTION_USER_SEARCH: "quickAction:userSearch",
} as const;

/**
 * 어드민 네비게이션 아이템 설정 (v7.0)
 *
 * v7.0 변경사항:
 * - tabs 필드 추가 (3depth 탭 지원)
 * - 세션 도메인 추가
 * - 설정 메뉴를 시설/관리자/역할권한으로 분리
 * - 사용자 → 회원으로 명칭 변경
 */
export const ADMIN_NAV_ITEMS: NavItemConfig[] = [
	// 1. 대시보드
	{
		id: "dashboard",
		label: "대시보드",
		icon: "LayoutDashboard",
		path: ADMIN_PATHS.DASHBOARD,
		subject: ADMIN_SUBJECTS.MENU_DASHBOARD,
	},

	// 2. 회원 (v7.0 명칭 변경)
	{
		id: "users",
		label: "회원",
		icon: "Users",
		subject: ADMIN_SUBJECTS.MENU_USERS,
		children: [
			{
				id: "users-list",
				label: "회원 목록",
				path: ADMIN_PATHS.USERS,
				subject: ADMIN_SUBJECTS.MENU_USERS_LIST,
				tabs: [
					{ id: "all", label: "전체", href: ADMIN_PATHS.USERS },
					{ id: "active", label: "활성", href: ADMIN_PATHS.USERS_ACTIVE },
					{ id: "dormant", label: "휴면", href: ADMIN_PATHS.USERS_DORMANT },
					{
						id: "pending-withdrawal",
						label: "탈퇴대기",
						href: ADMIN_PATHS.USERS_PENDING_WITHDRAWAL,
					},
				],
			},
			{
				id: "users-grades",
				label: "등급 관리",
				path: ADMIN_PATHS.USERS_GRADES,
				subject: ADMIN_SUBJECTS.MENU_USERS_GRADES,
			},
			{
				id: "users-withdrawn",
				label: "탈퇴 회원",
				path: ADMIN_PATHS.USERS_WITHDRAWN,
				subject: ADMIN_SUBJECTS.MENU_USERS_WITHDRAWN,
			},
		],
	},

	// 3. 예약
	{
		id: "reservations",
		label: "예약",
		icon: "CalendarCheck",
		subject: ADMIN_SUBJECTS.MENU_RESERVATIONS,
		children: [
			{
				id: "reservations-today",
				label: "오늘 예약",
				path: ADMIN_PATHS.RESERVATIONS_TODAY,
				subject: ADMIN_SUBJECTS.MENU_RESERVATIONS_TODAY,
			},
			{
				id: "reservations-list",
				label: "예약 목록",
				path: ADMIN_PATHS.RESERVATIONS,
				subject: ADMIN_SUBJECTS.MENU_RESERVATIONS_LIST,
				tabs: [
					{ id: "all", label: "전체", href: ADMIN_PATHS.RESERVATIONS },
					{ id: "pending", label: "대기중", href: ADMIN_PATHS.RESERVATIONS_PENDING },
					{ id: "confirmed", label: "확정", href: ADMIN_PATHS.RESERVATIONS_CONFIRMED },
					{ id: "cancelled", label: "취소", href: ADMIN_PATHS.RESERVATIONS_CANCELLED },
				],
			},
			{
				id: "reservations-calendar",
				label: "캘린더",
				path: ADMIN_PATHS.RESERVATIONS_CALENDAR,
				subject: ADMIN_SUBJECTS.MENU_RESERVATIONS_CALENDAR,
			},
			{
				id: "reservations-stats",
				label: "통계",
				path: ADMIN_PATHS.RESERVATIONS_STATS,
				subject: ADMIN_SUBJECTS.MENU_RESERVATIONS_STATS,
			},
		],
	},

	// 4. 알림
	{
		id: "notifications",
		label: "알림",
		icon: "Bell",
		subject: ADMIN_SUBJECTS.MENU_NOTIFICATIONS,
		children: [
			{
				id: "notifications-send",
				label: "알림 발송",
				path: ADMIN_PATHS.NOTIFICATIONS_SEND,
				subject: ADMIN_SUBJECTS.MENU_NOTIFICATIONS_SEND,
			},
			{
				id: "notifications-history",
				label: "발송 내역",
				path: ADMIN_PATHS.NOTIFICATIONS_HISTORY,
				subject: ADMIN_SUBJECTS.MENU_NOTIFICATIONS_HISTORY,
				tabs: [
					{ id: "all", label: "전체", href: ADMIN_PATHS.NOTIFICATIONS_HISTORY },
					{ id: "sms", label: "SMS", href: ADMIN_PATHS.NOTIFICATIONS_HISTORY_SMS },
					{ id: "email", label: "이메일", href: ADMIN_PATHS.NOTIFICATIONS_HISTORY_EMAIL },
					{ id: "push", label: "푸시", href: ADMIN_PATHS.NOTIFICATIONS_HISTORY_PUSH },
				],
			},
			{
				id: "notifications-templates",
				label: "알림 템플릿",
				path: ADMIN_PATHS.NOTIFICATIONS_TEMPLATES,
				subject: ADMIN_SUBJECTS.MENU_NOTIFICATIONS_TEMPLATES,
			},
			{
				id: "notifications-settings",
				label: "알림 설정",
				path: ADMIN_PATHS.NOTIFICATIONS_SETTINGS,
				subject: ADMIN_SUBJECTS.MENU_NOTIFICATIONS_SETTINGS,
			},
		],
	},

	// 5. 문의
	{
		id: "inquiries",
		label: "문의",
		icon: "MessageSquare",
		subject: ADMIN_SUBJECTS.MENU_INQUIRIES,
		children: [
			{
				id: "inquiries-list",
				label: "문의 목록",
				path: ADMIN_PATHS.INQUIRIES,
				subject: ADMIN_SUBJECTS.MENU_INQUIRIES_LIST,
				tabs: [
					{ id: "all", label: "전체", href: ADMIN_PATHS.INQUIRIES },
					{ id: "pending", label: "대기중", href: ADMIN_PATHS.INQUIRIES_PENDING },
					{ id: "completed", label: "답변완료", href: ADMIN_PATHS.INQUIRIES_COMPLETED },
				],
			},
			{
				id: "inquiries-direct",
				label: "1:1 문의",
				path: ADMIN_PATHS.INQUIRIES_DIRECT,
				subject: ADMIN_SUBJECTS.MENU_INQUIRIES_DIRECT,
			},
			{
				id: "inquiries-answered",
				label: "답변 완료",
				path: ADMIN_PATHS.INQUIRIES_ANSWERED,
				subject: ADMIN_SUBJECTS.MENU_INQUIRIES_ANSWERED,
			},
			{
				id: "inquiries-faq",
				label: "FAQ",
				path: ADMIN_PATHS.INQUIRIES_FAQ,
				subject: ADMIN_SUBJECTS.MENU_INQUIRIES_FAQ,
			},
		],
	},

	// 6. 콘텐츠
	{
		id: "contents",
		label: "콘텐츠",
		icon: "FileText",
		subject: ADMIN_SUBJECTS.MENU_CONTENTS,
		children: [
			{
				id: "contents-notices",
				label: "공지사항",
				path: ADMIN_PATHS.NOTICES,
				subject: ADMIN_SUBJECTS.MENU_CONTENTS_NOTICES,
			},
			{
				id: "contents-banners",
				label: "배너",
				path: ADMIN_PATHS.BANNERS,
				subject: ADMIN_SUBJECTS.MENU_CONTENTS_BANNERS,
			},
			{
				id: "contents-events",
				label: "이벤트",
				path: ADMIN_PATHS.EVENTS,
				subject: ADMIN_SUBJECTS.MENU_CONTENTS_EVENTS,
				tabs: [
					{ id: "all", label: "전체", href: ADMIN_PATHS.EVENTS },
					{ id: "ongoing", label: "진행중", href: ADMIN_PATHS.EVENTS_ONGOING },
					{ id: "upcoming", label: "예정", href: ADMIN_PATHS.EVENTS_UPCOMING },
					{ id: "ended", label: "종료", href: ADMIN_PATHS.EVENTS_ENDED },
				],
			},
			{
				id: "contents-terms",
				label: "이용약관",
				path: ADMIN_PATHS.TERMS,
				subject: ADMIN_SUBJECTS.MENU_CONTENTS_TERMS,
			},
		],
	},

	// 7. 템플릿
	{
		id: "templates",
		label: "템플릿",
		icon: "LayoutTemplate",
		subject: ADMIN_SUBJECTS.MENU_TEMPLATES,
		children: [
			{
				id: "templates-sms",
				label: "SMS",
				path: ADMIN_PATHS.TEMPLATES_SMS,
				subject: ADMIN_SUBJECTS.MENU_TEMPLATES_SMS,
			},
			{
				id: "templates-email",
				label: "이메일",
				path: ADMIN_PATHS.TEMPLATES_EMAIL,
				subject: ADMIN_SUBJECTS.MENU_TEMPLATES_EMAIL,
			},
			{
				id: "templates-push",
				label: "푸시",
				path: ADMIN_PATHS.TEMPLATES_PUSH,
				subject: ADMIN_SUBJECTS.MENU_TEMPLATES_PUSH,
			},
			{
				id: "templates-html",
				label: "HTML",
				path: ADMIN_PATHS.TEMPLATES_HTML,
				subject: ADMIN_SUBJECTS.MENU_TEMPLATES_HTML,
			},
		],
	},

	// 8. 세션 (v7.0 신규)
	{
		id: "sessions",
		label: "세션",
		icon: "Clock",
		subject: ADMIN_SUBJECTS.MENU_SESSIONS,
		children: [
			{
				id: "sessions-timelines",
				label: "타임라인",
				path: ADMIN_PATHS.SESSIONS_TIMELINES,
				subject: ADMIN_SUBJECTS.MENU_SESSIONS_TIMELINES,
				tabs: [
					{ id: "all", label: "전체", href: ADMIN_PATHS.SESSIONS_TIMELINES },
					{ id: "active", label: "활성", href: ADMIN_PATHS.SESSIONS_TIMELINES_ACTIVE },
					{ id: "archived", label: "보관됨", href: ADMIN_PATHS.SESSIONS_TIMELINES_ARCHIVED },
				],
			},
			{
				id: "sessions-list",
				label: "세션 목록",
				path: ADMIN_PATHS.SESSIONS,
				subject: ADMIN_SUBJECTS.MENU_SESSIONS_LIST,
				tabs: [
					{ id: "all", label: "전체", href: ADMIN_PATHS.SESSIONS },
					{ id: "one-time", label: "일회성", href: ADMIN_PATHS.SESSIONS_ONE_TIME },
					{ id: "recurring", label: "반복", href: ADMIN_PATHS.SESSIONS_RECURRING },
					{ id: "upcoming", label: "예정", href: ADMIN_PATHS.SESSIONS_UPCOMING },
					{ id: "past", label: "지난", href: ADMIN_PATHS.SESSIONS_PAST },
				],
			},
			{
				id: "sessions-programs",
				label: "프로그램 배정",
				path: ADMIN_PATHS.SESSIONS_PROGRAMS,
				subject: ADMIN_SUBJECTS.MENU_SESSIONS_PROGRAMS,
				tabs: [
					{ id: "all", label: "전체", href: ADMIN_PATHS.SESSIONS_PROGRAMS },
					{ id: "active", label: "진행중", href: ADMIN_PATHS.SESSIONS_PROGRAMS_ACTIVE },
					{ id: "full", label: "정원마감", href: ADMIN_PATHS.SESSIONS_PROGRAMS_FULL },
					{ id: "available", label: "예약가능", href: ADMIN_PATHS.SESSIONS_PROGRAMS_AVAILABLE },
				],
			},
			{
				id: "sessions-routines",
				label: "루틴",
				path: ADMIN_PATHS.SESSIONS_ROUTINES,
				subject: ADMIN_SUBJECTS.MENU_SESSIONS_ROUTINES,
				tabs: [
					{ id: "all", label: "전체", href: ADMIN_PATHS.SESSIONS_ROUTINES },
					{ id: "exercise", label: "운동", href: ADMIN_PATHS.SESSIONS_ROUTINES_EXERCISE },
				],
			},
		],
	},

	// 9. 시설 (v7.0 - 설정에서 분리)
	{
		id: "grounds",
		label: "시설",
		icon: "Building",
		subject: ADMIN_SUBJECTS.MENU_GROUNDS,
		children: [
			{
				id: "grounds-info",
				label: "시설 정보",
				path: ADMIN_PATHS.GROUNDS,
				subject: ADMIN_SUBJECTS.MENU_GROUNDS_INFO,
			},
			{
				id: "grounds-programs",
				label: "프로그램 정의",
				path: ADMIN_PATHS.GROUNDS_PROGRAMS,
				subject: ADMIN_SUBJECTS.MENU_GROUNDS_PROGRAMS,
			},
			{
				id: "grounds-equipment",
				label: "장비/시설물",
				path: ADMIN_PATHS.GROUNDS_EQUIPMENT,
				subject: ADMIN_SUBJECTS.MENU_GROUNDS_EQUIPMENT,
			},
		],
	},

	// 10. 관리자 (v7.0 - 설정에서 분리)
	{
		id: "admins",
		label: "관리자",
		icon: "UserCog",
		subject: ADMIN_SUBJECTS.MENU_ADMINS,
		children: [
			{
				id: "admins-list",
				label: "관리자 목록",
				path: ADMIN_PATHS.ADMINS,
				subject: ADMIN_SUBJECTS.MENU_ADMINS_LIST,
				tabs: [
					{ id: "all", label: "전체", href: ADMIN_PATHS.ADMINS },
					{ id: "active", label: "활성", href: ADMIN_PATHS.ADMINS_ACTIVE },
					{ id: "inactive", label: "비활성", href: ADMIN_PATHS.ADMINS_INACTIVE },
				],
			},
			{
				id: "admins-invitations",
				label: "초대 관리",
				path: ADMIN_PATHS.ADMINS_INVITATIONS,
				subject: ADMIN_SUBJECTS.MENU_ADMINS_INVITATIONS,
				tabs: [
					{ id: "all", label: "전체", href: ADMIN_PATHS.ADMINS_INVITATIONS },
					{ id: "pending", label: "대기중", href: ADMIN_PATHS.ADMINS_INVITATIONS_PENDING },
					{ id: "expired", label: "만료됨", href: ADMIN_PATHS.ADMINS_INVITATIONS_EXPIRED },
				],
			},
		],
	},

	// 11. 역할/권한 (v7.0 - 설정에서 분리)
	{
		id: "roles",
		label: "역할/권한",
		icon: "Shield",
		subject: ADMIN_SUBJECTS.MENU_ROLES,
		children: [
			{
				id: "roles-list",
				label: "역할 목록",
				path: ADMIN_PATHS.ROLES,
				subject: ADMIN_SUBJECTS.MENU_ROLES_LIST,
			},
			{
				id: "roles-abilities",
				label: "권한 설정",
				path: ADMIN_PATHS.ROLES_ABILITIES,
				subject: ADMIN_SUBJECTS.MENU_ROLES_ABILITIES,
			},
		],
	},
];

/**
 * 어드민 FAB 액션 설정 (v7.0 신규)
 *
 * 모바일 FAB에서 표시되는 빠른 액션 목록
 */
export const ADMIN_FAB_ACTIONS: FABAction[] = [
	{
		id: "todayReservation",
		label: "오늘 예약",
		icon: "CalendarCheck",
		subject: ADMIN_SUBJECTS.QUICK_ACTION_TODAY_RESERVATION,
		href: ADMIN_PATHS.RESERVATIONS_TODAY,
	},
	{
		id: "quickReservation",
		label: "빠른 예약",
		icon: "CalendarPlus",
		subject: ADMIN_SUBJECTS.QUICK_ACTION_QUICK_RESERVATION,
		modal: "quickReservation",
	},
	{
		id: "userSearch",
		label: "회원 검색",
		icon: "Search",
		subject: ADMIN_SUBJECTS.QUICK_ACTION_USER_SEARCH,
		modal: "userSearch",
	},
];

/**
 * BottomTab에 표시할 메뉴 ID 목록 (v7.0 신규)
 *
 * 순서대로 하단 탭에 표시됩니다.
 * 마지막 "more"는 특수 처리되어 나머지 메뉴를 표시합니다.
 */
export const BOTTOM_TAB_IDS = [
	"dashboard",
	"reservations",
	"users",
	"notifications",
	"more",
] as const;

export type BottomTabId = (typeof BOTTOM_TAB_IDS)[number];

/**
 * @deprecated ADMIN_NAV_ITEMS를 사용하세요
 */
export const ADMIN_MENUS = ADMIN_NAV_ITEMS;

// 타입 re-export (하위 호환성)
export type { NavItemConfig, TabConfig, FABAction };
