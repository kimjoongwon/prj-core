/**
 * 네비게이션 아이템 설정 인터페이스
 * @cocrepo/store의 NavItemConfig와 동일한 구조
 */
export interface NavItemConfig {
	id: string;
	label: string;
	path?: string;
	icon?: string;
	subject: string;
	children?: NavItemConfig[];
}

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

	// 사용자 (User 엔티티)
	USERS: "/users",
	USERS_GRADES: "/users/grades",
	USERS_WITHDRAWN: "/users/withdrawn",

	// 예약 (Reservation 엔티티)
	RESERVATIONS: "/reservations",
	RESERVATIONS_CALENDAR: "/reservations/calendar",
	RESERVATIONS_STATS: "/reservations/stats",
	RESERVATIONS_CANCELLED: "/reservations/cancelled",

	// 알림 (Notification 엔티티)
	NOTIFICATIONS: "/notifications",
	NOTIFICATIONS_SEND: "/notifications/send",
	NOTIFICATIONS_TEMPLATES: "/notifications/templates",
	NOTIFICATIONS_HISTORY: "/notifications/history",
	NOTIFICATIONS_SETTINGS: "/notifications/settings",

	// 문의 (Inquiry 엔티티)
	INQUIRIES: "/inquiries",
	INQUIRIES_ANSWERED: "/inquiries/answered",
	INQUIRIES_FAQ: "/inquiries/faq",
	INQUIRIES_DIRECT: "/inquiries/direct",

	// 콘텐츠 (Content 엔티티 하위)
	NOTICES: "/notices",
	EVENTS: "/events",
	BANNERS: "/banners",
	TERMS: "/terms",

	// 템플릿 (Template 엔티티)
	TEMPLATES: "/templates",
	TEMPLATES_EMAIL: "/templates/email",
	TEMPLATES_SMS: "/templates/sms",
	TEMPLATES_PUSH: "/templates/push",
	TEMPLATES_HTML: "/templates/html",

	// 설정
	SETTINGS: "/settings",
	SETTINGS_GROUNDS: "/settings/grounds",
	SETTINGS_ADMINS: "/settings/admins",
	SETTINGS_ABILITIES: "/settings/abilities",
	SETTINGS_COLUMNS: "/settings/columns",
	SETTINGS_SYSTEM: "/settings/system",

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

	// 주요 메뉴
	MENU_USERS: "menu:users",
	MENU_RESERVATIONS: "menu:reservations",
	MENU_NOTIFICATIONS: "menu:notifications",
	MENU_INQUIRIES: "menu:inquiries",
	MENU_CONTENTS: "menu:contents",
	MENU_TEMPLATES: "menu:templates",
	MENU_SETTINGS: "menu:settings",

	// 하위 메뉴 - 사용자
	MENU_USERS_MAIN: "menu:users:main",
	MENU_USERS_GRADES: "menu:users:grades",
	MENU_USERS_WITHDRAWN: "menu:users:withdrawn",

	// 하위 메뉴 - 예약
	MENU_RESERVATIONS_MAIN: "menu:reservations:main",
	MENU_RESERVATIONS_CALENDAR: "menu:reservations:calendar",
	MENU_RESERVATIONS_STATS: "menu:reservations:stats",
	MENU_RESERVATIONS_CANCELLED: "menu:reservations:cancelled",

	// 하위 메뉴 - 알림
	MENU_NOTIFICATIONS_SEND: "menu:notifications:send",
	MENU_NOTIFICATIONS_TEMPLATES: "menu:notifications:templates",
	MENU_NOTIFICATIONS_HISTORY: "menu:notifications:history",
	MENU_NOTIFICATIONS_SETTINGS: "menu:notifications:settings",

	// 하위 메뉴 - 문의
	MENU_INQUIRIES_MAIN: "menu:inquiries:main",
	MENU_INQUIRIES_ANSWERED: "menu:inquiries:answered",
	MENU_INQUIRIES_FAQ: "menu:inquiries:faq",
	MENU_INQUIRIES_DIRECT: "menu:inquiries:direct",

	// 하위 메뉴 - 콘텐츠
	MENU_CONTENTS_NOTICES: "menu:contents:notices",
	MENU_CONTENTS_EVENTS: "menu:contents:events",
	MENU_CONTENTS_BANNERS: "menu:contents:banners",
	MENU_CONTENTS_TERMS: "menu:contents:terms",

	// 하위 메뉴 - 템플릿
	MENU_TEMPLATES_EMAIL: "menu:templates:email",
	MENU_TEMPLATES_SMS: "menu:templates:sms",
	MENU_TEMPLATES_PUSH: "menu:templates:push",
	MENU_TEMPLATES_HTML: "menu:templates:html",

	// 하위 메뉴 - 설정
	MENU_SETTINGS_GROUNDS: "menu:settings:grounds",
	MENU_SETTINGS_ADMINS: "menu:settings:admins",
	MENU_SETTINGS_ABILITIES: "menu:settings:abilities",
	MENU_SETTINGS_COLUMNS: "menu:settings:columns",
	MENU_SETTINGS_SYSTEM: "menu:settings:system",
} as const;

/**
 * 어드민 네비게이션 아이템 설정
 */
export const ADMIN_NAV_ITEMS: NavItemConfig[] = [
	{
		id: "dashboard",
		label: "대시보드",
		icon: "LayoutDashboard",
		path: ADMIN_PATHS.DASHBOARD,
		subject: ADMIN_SUBJECTS.MENU_DASHBOARD,
	},
	{
		id: "users",
		label: "사용자",
		icon: "Users",
		subject: ADMIN_SUBJECTS.MENU_USERS,
		children: [
			{
				id: "users-main",
				label: "사용자 목록",
				path: ADMIN_PATHS.USERS,
				subject: ADMIN_SUBJECTS.MENU_USERS_MAIN,
			},
			{
				id: "users-grades",
				label: "등급 관리",
				path: ADMIN_PATHS.USERS_GRADES,
				subject: ADMIN_SUBJECTS.MENU_USERS_GRADES,
			},
			{
				id: "users-withdrawn",
				label: "탈퇴 사용자",
				path: ADMIN_PATHS.USERS_WITHDRAWN,
				subject: ADMIN_SUBJECTS.MENU_USERS_WITHDRAWN,
			},
		],
	},
	{
		id: "reservations",
		label: "예약",
		icon: "Calendar",
		subject: ADMIN_SUBJECTS.MENU_RESERVATIONS,
		children: [
			{
				id: "reservations-main",
				label: "예약 목록",
				path: ADMIN_PATHS.RESERVATIONS,
				subject: ADMIN_SUBJECTS.MENU_RESERVATIONS_MAIN,
			},
			{
				id: "reservations-calendar",
				label: "예약 캘린더",
				path: ADMIN_PATHS.RESERVATIONS_CALENDAR,
				subject: ADMIN_SUBJECTS.MENU_RESERVATIONS_CALENDAR,
			},
			{
				id: "reservations-stats",
				label: "예약 통계",
				path: ADMIN_PATHS.RESERVATIONS_STATS,
				subject: ADMIN_SUBJECTS.MENU_RESERVATIONS_STATS,
			},
			{
				id: "reservations-cancelled",
				label: "취소/환불",
				path: ADMIN_PATHS.RESERVATIONS_CANCELLED,
				subject: ADMIN_SUBJECTS.MENU_RESERVATIONS_CANCELLED,
			},
		],
	},
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
				id: "notifications-templates",
				label: "알림 템플릿",
				path: ADMIN_PATHS.NOTIFICATIONS_TEMPLATES,
				subject: ADMIN_SUBJECTS.MENU_NOTIFICATIONS_TEMPLATES,
			},
			{
				id: "notifications-history",
				label: "발송 이력",
				path: ADMIN_PATHS.NOTIFICATIONS_HISTORY,
				subject: ADMIN_SUBJECTS.MENU_NOTIFICATIONS_HISTORY,
			},
			{
				id: "notifications-settings",
				label: "푸시 설정",
				path: ADMIN_PATHS.NOTIFICATIONS_SETTINGS,
				subject: ADMIN_SUBJECTS.MENU_NOTIFICATIONS_SETTINGS,
			},
		],
	},
	{
		id: "inquiries",
		label: "문의",
		icon: "MessageSquare",
		subject: ADMIN_SUBJECTS.MENU_INQUIRIES,
		children: [
			{
				id: "inquiries-main",
				label: "문의 목록",
				path: ADMIN_PATHS.INQUIRIES,
				subject: ADMIN_SUBJECTS.MENU_INQUIRIES_MAIN,
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
			{
				id: "inquiries-direct",
				label: "1:1 문의",
				path: ADMIN_PATHS.INQUIRIES_DIRECT,
				subject: ADMIN_SUBJECTS.MENU_INQUIRIES_DIRECT,
			},
		],
	},
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
				id: "contents-events",
				label: "이벤트",
				path: ADMIN_PATHS.EVENTS,
				subject: ADMIN_SUBJECTS.MENU_CONTENTS_EVENTS,
			},
			{
				id: "contents-banners",
				label: "배너",
				path: ADMIN_PATHS.BANNERS,
				subject: ADMIN_SUBJECTS.MENU_CONTENTS_BANNERS,
			},
			{
				id: "contents-terms",
				label: "약관",
				path: ADMIN_PATHS.TERMS,
				subject: ADMIN_SUBJECTS.MENU_CONTENTS_TERMS,
			},
		],
	},
	{
		id: "templates",
		label: "템플릿",
		icon: "LayoutTemplate",
		subject: ADMIN_SUBJECTS.MENU_TEMPLATES,
		children: [
			{
				id: "templates-email",
				label: "이메일",
				path: ADMIN_PATHS.TEMPLATES_EMAIL,
				subject: ADMIN_SUBJECTS.MENU_TEMPLATES_EMAIL,
			},
			{
				id: "templates-sms",
				label: "SMS",
				path: ADMIN_PATHS.TEMPLATES_SMS,
				subject: ADMIN_SUBJECTS.MENU_TEMPLATES_SMS,
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
	{
		id: "settings",
		label: "설정",
		icon: "Settings",
		subject: ADMIN_SUBJECTS.MENU_SETTINGS,
		children: [
			{
				id: "settings-grounds",
				label: "Ground 정보",
				path: ADMIN_PATHS.SETTINGS_GROUNDS,
				subject: ADMIN_SUBJECTS.MENU_SETTINGS_GROUNDS,
			},
			{
				id: "settings-admins",
				label: "관리자 계정",
				path: ADMIN_PATHS.SETTINGS_ADMINS,
				subject: ADMIN_SUBJECTS.MENU_SETTINGS_ADMINS,
			},
			{
				id: "settings-abilities",
				label: "권한 관리",
				path: ADMIN_PATHS.SETTINGS_ABILITIES,
				subject: ADMIN_SUBJECTS.MENU_SETTINGS_ABILITIES,
			},
			{
				id: "settings-columns",
				label: "컬럼 가시성",
				path: ADMIN_PATHS.SETTINGS_COLUMNS,
				subject: ADMIN_SUBJECTS.MENU_SETTINGS_COLUMNS,
			},
			{
				id: "settings-system",
				label: "시스템 설정",
				path: ADMIN_PATHS.SETTINGS_SYSTEM,
				subject: ADMIN_SUBJECTS.MENU_SETTINGS_SYSTEM,
			},
		],
	},
];

/**
 * @deprecated ADMIN_NAV_ITEMS를 사용하세요
 */
export const ADMIN_MENUS = ADMIN_NAV_ITEMS;

/**
 * @deprecated 이 인터페이스는 @cocrepo/store의 NavItemConfig를 사용하세요
 */
export interface Menu {
	id: string;
	label: string;
	path?: string;
	icon?: string;
	subject: string;
	children?: Menu[];
}
