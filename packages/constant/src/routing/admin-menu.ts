/**
 * 메뉴 인터페이스
 */
export interface Menu {
	id: string;
	label: string;
	path?: string;
	icon?: string;
	subject: string;
	children?: Menu[];
}

/**
 * 어드민 메뉴 경로 상수
 */
export const ADMIN_PATHS = {
	// 대시보드
	DASHBOARD: "/dashboard",

	// 회원
	MEMBERS: "/members",
	MEMBERS_GRADES: "/members/grades",
	MEMBERS_WITHDRAWN: "/members/withdrawn",

	// 예약
	RESERVATIONS: "/reservations",
	RESERVATIONS_CALENDAR: "/reservations/calendar",
	RESERVATIONS_STATISTICS: "/reservations/statistics",
	RESERVATIONS_CANCELLATIONS: "/reservations/cancellations",

	// 알림
	NOTIFICATIONS_SEND: "/notifications/send",
	NOTIFICATIONS_TEMPLATES: "/notifications/templates",
	NOTIFICATIONS_HISTORY: "/notifications/history",
	NOTIFICATIONS_SETTINGS: "/notifications/settings",

	// 문의
	INQUIRIES: "/inquiries",
	INQUIRIES_ANSWERS: "/inquiries/answers",
	INQUIRIES_FAQ: "/inquiries/faq",
	INQUIRIES_1ON1: "/inquiries/1on1",

	// 콘텐츠
	CONTENTS_NOTICES: "/contents/notices",
	CONTENTS_EVENTS: "/contents/events",
	CONTENTS_BANNERS: "/contents/banners",
	CONTENTS_TERMS: "/contents/terms",

	// 템플릿
	TEMPLATES_EMAIL: "/templates/email",
	TEMPLATES_SMS: "/templates/sms",
	TEMPLATES_PUSH: "/templates/push",
	TEMPLATES_HTML: "/templates/html",

	// 설정
	SETTINGS_GROUND: "/settings/ground",
	SETTINGS_ADMINS: "/settings/admins",
	SETTINGS_PERMISSIONS: "/settings/permissions",
	SETTINGS_COLUMNS: "/settings/columns",
	SETTINGS_SYSTEM: "/settings/system",

	// 기타
	SELECT_SPACE: "/select-space",
	AUTH_LOGIN: "/auth/login",
} as const;

/**
 * 어드민 메뉴 Subject 상수
 */
export const ADMIN_SUBJECTS = {
	// 대시보드
	MENU_DASHBOARD: "menu:dashboard",

	// 주요 메뉴
	MENU_MEMBERS: "menu:members",
	MENU_RESERVATIONS: "menu:reservations",
	MENU_NOTIFICATIONS: "menu:notifications",
	MENU_INQUIRIES: "menu:inquiries",
	MENU_CONTENTS: "menu:contents",
	MENU_TEMPLATES: "menu:templates",
	MENU_SETTINGS: "menu:settings",

	// 하위 메뉴 - 회원
	MENU_MEMBERS_LIST: "menu:members:list",
	MENU_MEMBERS_GRADES: "menu:members:grades",
	MENU_MEMBERS_WITHDRAWN: "menu:members:withdrawn",

	// 하위 메뉴 - 예약
	MENU_RESERVATIONS_LIST: "menu:reservations:list",
	MENU_RESERVATIONS_CALENDAR: "menu:reservations:calendar",
	MENU_RESERVATIONS_STATISTICS: "menu:reservations:statistics",
	MENU_RESERVATIONS_CANCELLATIONS: "menu:reservations:cancellations",

	// 하위 메뉴 - 알림
	MENU_NOTIFICATIONS_SEND: "menu:notifications:send",
	MENU_NOTIFICATIONS_TEMPLATES: "menu:notifications:templates",
	MENU_NOTIFICATIONS_HISTORY: "menu:notifications:history",
	MENU_NOTIFICATIONS_SETTINGS: "menu:notifications:settings",

	// 하위 메뉴 - 문의
	MENU_INQUIRIES_LIST: "menu:inquiries:list",
	MENU_INQUIRIES_ANSWERS: "menu:inquiries:answers",
	MENU_INQUIRIES_FAQ: "menu:inquiries:faq",
	MENU_INQUIRIES_1ON1: "menu:inquiries:1on1",

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
	MENU_SETTINGS_GROUND: "menu:settings:ground",
	MENU_SETTINGS_ADMINS: "menu:settings:admins",
	MENU_SETTINGS_PERMISSIONS: "menu:settings:permissions",
	MENU_SETTINGS_COLUMNS: "menu:settings:columns",
	MENU_SETTINGS_SYSTEM: "menu:settings:system",
} as const;

export const ADMIN_MENUS: Menu[] = [
	{
		id: "dashboard",
		label: "대시보드",
		icon: "LayoutDashboard",
		path: ADMIN_PATHS.DASHBOARD,
		subject: ADMIN_SUBJECTS.MENU_DASHBOARD,
		// children 없음 - 클릭 시 바로 이동
	},
	{
		id: "members",
		label: "회원",
		icon: "Users",
		subject: ADMIN_SUBJECTS.MENU_MEMBERS,
		children: [
			{
				id: "members-list",
				label: "회원 목록",
				path: ADMIN_PATHS.MEMBERS,
				subject: ADMIN_SUBJECTS.MENU_MEMBERS_LIST,
			},
			{
				id: "members-grade",
				label: "회원 등급 관리",
				path: ADMIN_PATHS.MEMBERS_GRADES,
				subject: ADMIN_SUBJECTS.MENU_MEMBERS_GRADES,
			},
			{
				id: "members-withdrawn",
				label: "탈퇴 회원",
				path: ADMIN_PATHS.MEMBERS_WITHDRAWN,
				subject: ADMIN_SUBJECTS.MENU_MEMBERS_WITHDRAWN,
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
				id: "reservations-list",
				label: "예약 목록",
				path: ADMIN_PATHS.RESERVATIONS,
				subject: ADMIN_SUBJECTS.MENU_RESERVATIONS_LIST,
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
				path: ADMIN_PATHS.RESERVATIONS_STATISTICS,
				subject: ADMIN_SUBJECTS.MENU_RESERVATIONS_STATISTICS,
			},
			{
				id: "reservations-cancel",
				label: "취소/환불 관리",
				path: ADMIN_PATHS.RESERVATIONS_CANCELLATIONS,
				subject: ADMIN_SUBJECTS.MENU_RESERVATIONS_CANCELLATIONS,
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
				id: "inquiries-list",
				label: "문의 목록",
				path: ADMIN_PATHS.INQUIRIES,
				subject: ADMIN_SUBJECTS.MENU_INQUIRIES_LIST,
			},
			{
				id: "inquiries-answer",
				label: "답변 관리",
				path: ADMIN_PATHS.INQUIRIES_ANSWERS,
				subject: ADMIN_SUBJECTS.MENU_INQUIRIES_ANSWERS,
			},
			{
				id: "inquiries-faq",
				label: "FAQ 관리",
				path: ADMIN_PATHS.INQUIRIES_FAQ,
				subject: ADMIN_SUBJECTS.MENU_INQUIRIES_FAQ,
			},
			{
				id: "inquiries-1on1",
				label: "1:1 문의",
				path: ADMIN_PATHS.INQUIRIES_1ON1,
				subject: ADMIN_SUBJECTS.MENU_INQUIRIES_1ON1,
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
				path: ADMIN_PATHS.CONTENTS_NOTICES,
				subject: ADMIN_SUBJECTS.MENU_CONTENTS_NOTICES,
			},
			{
				id: "contents-events",
				label: "이벤트",
				path: ADMIN_PATHS.CONTENTS_EVENTS,
				subject: ADMIN_SUBJECTS.MENU_CONTENTS_EVENTS,
			},
			{
				id: "contents-banners",
				label: "배너 관리",
				path: ADMIN_PATHS.CONTENTS_BANNERS,
				subject: ADMIN_SUBJECTS.MENU_CONTENTS_BANNERS,
			},
			{
				id: "contents-terms",
				label: "약관 관리",
				path: ADMIN_PATHS.CONTENTS_TERMS,
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
				label: "이메일 템플릿",
				path: ADMIN_PATHS.TEMPLATES_EMAIL,
				subject: ADMIN_SUBJECTS.MENU_TEMPLATES_EMAIL,
			},
			{
				id: "templates-sms",
				label: "SMS 템플릿",
				path: ADMIN_PATHS.TEMPLATES_SMS,
				subject: ADMIN_SUBJECTS.MENU_TEMPLATES_SMS,
			},
			{
				id: "templates-push",
				label: "푸시 템플릿",
				path: ADMIN_PATHS.TEMPLATES_PUSH,
				subject: ADMIN_SUBJECTS.MENU_TEMPLATES_PUSH,
			},
			{
				id: "templates-html",
				label: "HTML 템플릿",
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
				id: "settings-ground",
				label: "Ground 정보",
				path: ADMIN_PATHS.SETTINGS_GROUND,
				subject: ADMIN_SUBJECTS.MENU_SETTINGS_GROUND,
			},
			{
				id: "settings-admins",
				label: "관리자 계정",
				path: ADMIN_PATHS.SETTINGS_ADMINS,
				subject: ADMIN_SUBJECTS.MENU_SETTINGS_ADMINS,
			},
			{
				id: "settings-permissions",
				label: "권한 관리",
				path: ADMIN_PATHS.SETTINGS_PERMISSIONS,
				subject: ADMIN_SUBJECTS.MENU_SETTINGS_PERMISSIONS,
			},
			{
				id: "settings-columns",
				label: "컬럼 가시성 관리",
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
