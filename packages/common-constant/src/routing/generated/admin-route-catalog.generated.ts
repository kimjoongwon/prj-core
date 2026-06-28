import type { NavItemConfig } from "@cocrepo/type";
import type { GeneratedAdminPageAccessItem } from "../admin-route-meta";

export const GENERATED_ADMIN_ROUTE_META_SOURCES: string[] = [
	"apps/admin/web/src/app/(admin)/abilities/[abilityId]/edit/route.meta.ts",
	"apps/admin/web/src/app/(admin)/abilities/[abilityId]/route.meta.ts",
	"apps/admin/web/src/app/(admin)/abilities/new/route.meta.ts",
	"apps/admin/web/src/app/(admin)/abilities/route.meta.ts",
	"apps/admin/web/src/app/(admin)/actions/[actionId]/edit/route.meta.ts",
	"apps/admin/web/src/app/(admin)/actions/[actionId]/route.meta.ts",
	"apps/admin/web/src/app/(admin)/actions/new/route.meta.ts",
	"apps/admin/web/src/app/(admin)/actions/route.meta.ts",
	"apps/admin/web/src/app/(admin)/assets/[assetId]/route.meta.ts",
	"apps/admin/web/src/app/(admin)/assets/route.meta.ts",
	"apps/admin/web/src/app/(admin)/course-offerings/route.meta.ts",
	"apps/admin/web/src/app/(admin)/course-passes/route.meta.ts",
	"apps/admin/web/src/app/(admin)/courses/route.meta.ts",
	"apps/admin/web/src/app/(admin)/dashboard/route.meta.ts",
	"apps/admin/web/src/app/(admin)/email-verifications/route.meta.ts",
	"apps/admin/web/src/app/(admin)/enrollments/route.meta.ts",
	"apps/admin/web/src/app/(admin)/inquiries/[inquiryId]/edit/route.meta.ts",
	"apps/admin/web/src/app/(admin)/inquiries/[inquiryId]/route.meta.ts",
	"apps/admin/web/src/app/(admin)/inquiries/new/route.meta.ts",
	"apps/admin/web/src/app/(admin)/inquiries/route.meta.ts",
	"apps/admin/web/src/app/(admin)/payments/route.meta.ts",
	"apps/admin/web/src/app/(admin)/policies/[policyId]/edit/route.meta.ts",
	"apps/admin/web/src/app/(admin)/policies/[policyId]/route.meta.ts",
	"apps/admin/web/src/app/(admin)/policies/new/route.meta.ts",
	"apps/admin/web/src/app/(admin)/policies/route.meta.ts",
	"apps/admin/web/src/app/(admin)/roles/[roleId]/edit/route.meta.ts",
	"apps/admin/web/src/app/(admin)/roles/[roleId]/route.meta.ts",
	"apps/admin/web/src/app/(admin)/roles/new/route.meta.ts",
	"apps/admin/web/src/app/(admin)/roles/route.meta.ts",
	"apps/admin/web/src/app/(admin)/routines/[routineId]/edit/route.meta.ts",
	"apps/admin/web/src/app/(admin)/routines/[routineId]/route.meta.ts",
	"apps/admin/web/src/app/(admin)/routines/new/route.meta.ts",
	"apps/admin/web/src/app/(admin)/routines/route.meta.ts",
	"apps/admin/web/src/app/(admin)/settings/auth/accounts/[userId]/route.meta.ts",
	"apps/admin/web/src/app/(admin)/settings/auth/accounts/route.meta.ts",
	"apps/admin/web/src/app/(admin)/settings/auth/audit-logs/route.meta.ts",
	"apps/admin/web/src/app/(admin)/settings/auth/oidc-clients/[oidcClientId]/edit/route.meta.ts",
	"apps/admin/web/src/app/(admin)/settings/auth/oidc-clients/[oidcClientId]/route.meta.ts",
	"apps/admin/web/src/app/(admin)/settings/auth/oidc-clients/new/route.meta.ts",
	"apps/admin/web/src/app/(admin)/settings/auth/oidc-clients/route.meta.ts",
	"apps/admin/web/src/app/(admin)/settings/auth/oidc-sessions/route.meta.ts",
	"apps/admin/web/src/app/(admin)/settings/auth/route.meta.ts",
	"apps/admin/web/src/app/(admin)/settings/auth/security-policy/route.meta.ts",
	"apps/admin/web/src/app/(admin)/spaces/[spaceId]/ground/edit/route.meta.ts",
	"apps/admin/web/src/app/(admin)/spaces/[spaceId]/ground/route.meta.ts",
	"apps/admin/web/src/app/(admin)/spaces/new/route.meta.ts",
	"apps/admin/web/src/app/(admin)/spaces/route.meta.ts",
	"apps/admin/web/src/app/(admin)/subjects/[subjectId]/route.meta.ts",
	"apps/admin/web/src/app/(admin)/subjects/route.meta.ts",
	"apps/admin/web/src/app/(admin)/tasks/[taskId]/exercise/edit/route.meta.ts",
	"apps/admin/web/src/app/(admin)/tasks/[taskId]/exercise/route.meta.ts",
	"apps/admin/web/src/app/(admin)/tasks/new/route.meta.ts",
	"apps/admin/web/src/app/(admin)/tasks/route.meta.ts",
	"apps/admin/web/src/app/(admin)/templates/[templateId]/edit/route.meta.ts",
	"apps/admin/web/src/app/(admin)/templates/[templateId]/route.meta.ts",
	"apps/admin/web/src/app/(admin)/templates/new/route.meta.ts",
	"apps/admin/web/src/app/(admin)/templates/route.meta.ts",
	"apps/admin/web/src/app/(admin)/tenant-access-requests/[tenantAccessRequestId]/route.meta.ts",
	"apps/admin/web/src/app/(admin)/tenant-access-requests/route.meta.ts",
	"apps/admin/web/src/app/(admin)/terms/route.meta.ts",
	"apps/admin/web/src/app/(admin)/timelines/[timelineId]/edit/route.meta.ts",
	"apps/admin/web/src/app/(admin)/timelines/[timelineId]/route.meta.ts",
	"apps/admin/web/src/app/(admin)/timelines/[timelineId]/sessions/[sessionId]/edit/route.meta.ts",
	"apps/admin/web/src/app/(admin)/timelines/[timelineId]/sessions/[sessionId]/programs/[programId]/edit/route.meta.ts",
	"apps/admin/web/src/app/(admin)/timelines/[timelineId]/sessions/[sessionId]/programs/[programId]/route.meta.ts",
	"apps/admin/web/src/app/(admin)/timelines/[timelineId]/sessions/[sessionId]/programs/new/route.meta.ts",
	"apps/admin/web/src/app/(admin)/timelines/[timelineId]/sessions/[sessionId]/route.meta.ts",
	"apps/admin/web/src/app/(admin)/timelines/[timelineId]/sessions/new/route.meta.ts",
	"apps/admin/web/src/app/(admin)/timelines/new/route.meta.ts",
	"apps/admin/web/src/app/(admin)/timelines/route.meta.ts",
	"apps/admin/web/src/app/(admin)/translations/route.meta.ts",
	"apps/admin/web/src/app/(admin)/users/[userId]/route.meta.ts",
	"apps/admin/web/src/app/(admin)/users/route.meta.ts"
];

export const GENERATED_ADMIN_NAV_ITEMS: NavItemConfig[] = [
	{
		"id": "dashboard",
		"label": "대시보드",
		"path": "/dashboard",
		"icon": "LayoutDashboard",
		"subject": "menu:dashboard"
	},
	{
		"id": "users",
		"label": "회원",
		"icon": "Users",
		"path": "/users",
		"subject": "menu:users",
		"children": [
			{
				"id": "users-list",
				"label": "회원 목록",
				"path": "/users",
				"subject": "menu:users:list"
			},
			{
				"id": "email-verifications-list",
				"label": "이메일 인증",
				"path": "/email-verifications",
				"subject": "menu:users:email-verifications"
			}
		]
	},
	{
		"id": "spaces",
		"label": "공간 관리",
		"icon": "Building2",
		"subject": "menu:spaces",
		"children": [
			{
				"id": "spaces-list",
				"label": "공간 목록",
				"path": "/spaces",
				"subject": "menu:spaces:list"
			}
		]
	},
	{
		"id": "timelines",
		"label": "일정 관리",
		"icon": "CalendarDays",
		"subject": "menu:timelines",
		"children": [
			{
				"id": "timelines-list",
				"label": "타임라인",
				"path": "/timelines",
				"subject": "menu:timelines:list"
			}
		]
	},
	{
		"id": "tasks",
		"label": "태스크 관리",
		"icon": "Dumbbell",
		"subject": "menu:tasks",
		"children": [
			{
				"id": "tasks-list",
				"label": "태스크 목록",
				"path": "/tasks",
				"subject": "menu:tasks:list"
			},
			{
				"id": "routines-list",
				"label": "루틴",
				"path": "/routines",
				"subject": "menu:routines:list"
			}
		]
	},
	{
		"id": "templates",
		"label": "템플릿",
		"icon": "Mail",
		"subject": "menu:templates",
		"children": [
			{
				"id": "templates-list",
				"label": "템플릿 목록",
				"path": "/templates",
				"subject": "menu:templates:list"
			}
		]
	},
	{
		"id": "assets",
		"label": "에셋",
		"icon": "Images",
		"path": "/assets",
		"subject": "menu:assets",
		"children": [
			{
				"id": "assets-list",
				"label": "에셋 목록",
				"path": "/assets",
				"subject": "menu:assets:list"
			}
		]
	},
	{
		"id": "inquiries",
		"label": "문의 관리",
		"icon": "MessageCircleQuestionMark",
		"path": "/inquiries",
		"subject": "menu:inquiries",
		"children": [
			{
				"id": "inquiries-list",
				"label": "문의 목록",
				"path": "/inquiries",
				"subject": "menu:inquiries:list"
			}
		]
	},
	{
		"id": "roles",
		"label": "권한 관리",
		"icon": "Shield",
		"subject": "menu:roles",
		"children": [
			{
				"id": "roles-list",
				"label": "역할",
				"path": "/roles",
				"subject": "menu:roles:list"
			},
			{
				"id": "abilities-list",
				"label": "권한 정의",
				"path": "/abilities",
				"subject": "menu:abilities:list"
			},
			{
				"id": "actions-list",
				"label": "액션",
				"path": "/actions",
				"subject": "menu:actions:list"
			},
			{
				"id": "subjects-list",
				"label": "대상",
				"path": "/subjects",
				"subject": "menu:subjects:list"
			},
			{
				"id": "policies-list",
				"label": "정책",
				"path": "/policies",
				"subject": "menu:policies:list"
			}
		]
	},
	{
		"id": "tenant-access-requests",
		"label": "접근 승인",
		"icon": "ShieldCheck",
		"path": "/tenant-access-requests",
		"subject": "menu:tenant-access-requests",
		"children": [
			{
				"id": "tenant-access-requests-list",
				"label": "접근 승인",
				"path": "/tenant-access-requests",
				"subject": "menu:tenant-access-requests:list"
			}
		]
	},
	{
		"id": "translations",
		"label": "다국어",
		"icon": "Settings",
		"subject": "menu:translations",
		"children": [
			{
				"id": "translations-list",
				"label": "정적 번역",
				"path": "/translations",
				"subject": "menu:translations:list"
			}
		]
	},
	{
		"id": "terms",
		"label": "약관 관리",
		"icon": "FileSearch",
		"subject": "menu:terms",
		"children": [
			{
				"id": "terms-list",
				"label": "약관 관리",
				"path": "/terms",
				"subject": "menu:terms:list"
			}
		]
	},
	{
		"id": "courses",
		"label": "수강 관리",
		"icon": "Ticket",
		"subject": "menu:courses",
		"children": [
			{
				"id": "courses-list",
				"label": "Course",
				"path": "/courses",
				"subject": "menu:courses:list"
			},
			{
				"id": "course-offerings-list",
				"label": "CourseOffering",
				"path": "/course-offerings",
				"subject": "menu:course-offerings:list"
			},
			{
				"id": "enrollments-list",
				"label": "Enrollment",
				"path": "/enrollments",
				"subject": "menu:enrollments:list"
			},
			{
				"id": "course-passes-list",
				"label": "CoursePass",
				"path": "/course-passes",
				"subject": "menu:course-passes:list"
			}
		]
	},
	{
		"id": "payments",
		"label": "결제 관리",
		"icon": "CreditCard",
		"subject": "menu:payments",
		"children": [
			{
				"id": "payments-list",
				"label": "Payment",
				"path": "/payments",
				"subject": "menu:payments:list"
			}
		]
	},
	{
		"id": "settings-auth",
		"label": "인증 설정",
		"icon": "KeyRound",
		"path": "/settings/auth",
		"subject": "menu:settings-auth",
		"children": [
			{
				"id": "settings-auth-dashboard",
				"label": "인증 대시보드",
				"path": "/settings/auth",
				"subject": "menu:settings-auth:dashboard"
			},
			{
				"id": "settings-auth-accounts",
				"label": "계정",
				"path": "/settings/auth/accounts",
				"subject": "menu:settings-auth:accounts"
			},
			{
				"id": "settings-auth-oidc-clients",
				"label": "OIDC 클라이언트",
				"path": "/settings/auth/oidc-clients",
				"subject": "menu:settings-auth:oidc-clients"
			},
			{
				"id": "settings-auth-oidc-sessions",
				"label": "OIDC 세션",
				"path": "/settings/auth/oidc-sessions",
				"subject": "menu:settings-auth:oidc-sessions"
			},
			{
				"id": "settings-auth-audit-logs",
				"label": "인증 감사 로그",
				"path": "/settings/auth/audit-logs",
				"subject": "menu:settings-auth:audit-logs"
			},
			{
				"id": "settings-auth-security-policy",
				"label": "보안 정책",
				"path": "/settings/auth/security-policy",
				"subject": "menu:settings-auth:security-policy"
			}
		]
	}
];

export const GENERATED_ADMIN_PAGE_ACCESS_ITEMS: GeneratedAdminPageAccessItem[] = [
	{
		"groupId": "dashboard",
		"groupLabel": "대시보드",
		"pageId": "dashboard",
		"pageLabel": "대시보드",
		"pathPattern": "/dashboard",
		"subject": "page:dashboard",
		"description": "운영 지표와 최근 상태를 확인하는 첫 화면입니다."
	},
	{
		"groupId": "users",
		"groupLabel": "회원",
		"pageId": "users:list",
		"pageLabel": "회원 목록",
		"pathPattern": "/users",
		"subject": "page:users:list",
		"description": "회원 목록과 검색 결과를 확인합니다.",
		"menuLeafId": "users-list"
	},
	{
		"groupId": "users",
		"groupLabel": "회원",
		"pageId": "users:detail",
		"pageLabel": "회원 상세",
		"pathPattern": "/users/[userId]",
		"subject": "page:users:detail",
		"description": "회원 상세 정보를 확인합니다."
	},
	{
		"groupId": "spaces",
		"groupLabel": "공간 관리",
		"pageId": "spaces:list",
		"pageLabel": "공간 목록",
		"pathPattern": "/spaces",
		"subject": "page:spaces:list",
		"description": "공간과 연결된 ground 목록을 관리합니다.",
		"menuLeafId": "spaces-list"
	},
	{
		"groupId": "spaces",
		"groupLabel": "공간 관리",
		"pageId": "spaces:new",
		"pageLabel": "공간 등록",
		"pathPattern": "/spaces/new",
		"subject": "page:spaces:new",
		"description": "새 공간을 등록합니다."
	},
	{
		"groupId": "spaces",
		"groupLabel": "공간 관리",
		"pageId": "spaces:detail",
		"pageLabel": "공간 상세",
		"pathPattern": "/spaces/[spaceId]/ground",
		"subject": "page:spaces:detail",
		"description": "선택한 공간의 상세 정보를 확인합니다."
	},
	{
		"groupId": "spaces",
		"groupLabel": "공간 관리",
		"pageId": "spaces:edit",
		"pageLabel": "공간 수정",
		"pathPattern": "/spaces/[spaceId]/ground/edit",
		"subject": "page:spaces:edit",
		"description": "선택한 공간의 정보를 수정합니다."
	},
	{
		"groupId": "timelines",
		"groupLabel": "일정 관리",
		"pageId": "timelines:list",
		"pageLabel": "타임라인 목록",
		"pathPattern": "/timelines",
		"subject": "page:timelines:list",
		"description": "타임라인 목록을 조회합니다.",
		"menuLeafId": "timelines-list"
	},
	{
		"groupId": "timelines",
		"groupLabel": "일정 관리",
		"pageId": "timelines:new",
		"pageLabel": "타임라인 등록",
		"pathPattern": "/timelines/new",
		"subject": "page:timelines:new",
		"description": "새 타임라인을 등록합니다."
	},
	{
		"groupId": "timelines",
		"groupLabel": "일정 관리",
		"pageId": "timelines:detail",
		"pageLabel": "타임라인 상세",
		"pathPattern": "/timelines/[timelineId]",
		"subject": "page:timelines:detail",
		"description": "타임라인 상세 정보를 확인합니다."
	},
	{
		"groupId": "timelines",
		"groupLabel": "일정 관리",
		"pageId": "timelines:edit",
		"pageLabel": "타임라인 수정",
		"pathPattern": "/timelines/[timelineId]/edit",
		"subject": "page:timelines:edit",
		"description": "타임라인 정보를 수정합니다."
	},
	{
		"groupId": "timelines",
		"groupLabel": "일정 관리",
		"pageId": "sessions:new",
		"pageLabel": "세션 등록",
		"pathPattern": "/timelines/[timelineId]/sessions/new",
		"subject": "page:sessions:new",
		"description": "타임라인에 새 세션을 추가합니다."
	},
	{
		"groupId": "timelines",
		"groupLabel": "일정 관리",
		"pageId": "sessions:detail",
		"pageLabel": "세션 상세",
		"pathPattern": "/timelines/[timelineId]/sessions/[sessionId]",
		"subject": "page:sessions:detail",
		"description": "세션 상세 정보를 확인합니다."
	},
	{
		"groupId": "timelines",
		"groupLabel": "일정 관리",
		"pageId": "sessions:edit",
		"pageLabel": "세션 수정",
		"pathPattern": "/timelines/[timelineId]/sessions/[sessionId]/edit",
		"subject": "page:sessions:edit",
		"description": "세션 정보를 수정합니다."
	},
	{
		"groupId": "timelines",
		"groupLabel": "일정 관리",
		"pageId": "programs:new",
		"pageLabel": "프로그램 등록",
		"pathPattern": "/timelines/[timelineId]/sessions/[sessionId]/programs/new",
		"subject": "page:programs:new",
		"description": "세션에 새 프로그램을 추가합니다."
	},
	{
		"groupId": "timelines",
		"groupLabel": "일정 관리",
		"pageId": "programs:detail",
		"pageLabel": "프로그램 상세",
		"pathPattern": "/timelines/[timelineId]/sessions/[sessionId]/programs/[programId]",
		"subject": "page:programs:detail",
		"description": "프로그램 상세 정보를 확인합니다."
	},
	{
		"groupId": "timelines",
		"groupLabel": "일정 관리",
		"pageId": "programs:edit",
		"pageLabel": "프로그램 수정",
		"pathPattern": "/timelines/[timelineId]/sessions/[sessionId]/programs/[programId]/edit",
		"subject": "page:programs:edit",
		"description": "프로그램 정보를 수정합니다."
	},
	{
		"groupId": "tasks",
		"groupLabel": "태스크 관리",
		"pageId": "tasks:list",
		"pageLabel": "태스크 목록",
		"pathPattern": "/tasks",
		"subject": "page:tasks:list",
		"description": "태스크 목록을 조회합니다.",
		"menuLeafId": "tasks-list"
	},
	{
		"groupId": "tasks",
		"groupLabel": "태스크 관리",
		"pageId": "tasks:new",
		"pageLabel": "태스크 등록",
		"pathPattern": "/tasks/new",
		"subject": "page:tasks:new",
		"description": "새 태스크를 등록합니다."
	},
	{
		"groupId": "tasks",
		"groupLabel": "태스크 관리",
		"pageId": "tasks:detail",
		"pageLabel": "태스크 상세",
		"pathPattern": "/tasks/[taskId]/exercise",
		"subject": "page:tasks:detail",
		"description": "태스크 상세 정보를 확인합니다."
	},
	{
		"groupId": "tasks",
		"groupLabel": "태스크 관리",
		"pageId": "tasks:edit",
		"pageLabel": "태스크 수정",
		"pathPattern": "/tasks/[taskId]/exercise/edit",
		"subject": "page:tasks:edit",
		"description": "태스크 정보를 수정합니다."
	},
	{
		"groupId": "routines",
		"groupLabel": "루틴",
		"pageId": "routines:list",
		"pageLabel": "루틴 목록",
		"pathPattern": "/routines",
		"subject": "page:routines:list",
		"description": "루틴 목록을 조회합니다.",
		"menuLeafId": "routines-list"
	},
	{
		"groupId": "routines",
		"groupLabel": "루틴",
		"pageId": "routines:new",
		"pageLabel": "루틴 등록",
		"pathPattern": "/routines/new",
		"subject": "page:routines:new",
		"description": "새 루틴을 등록합니다."
	},
	{
		"groupId": "routines",
		"groupLabel": "루틴",
		"pageId": "routines:detail",
		"pageLabel": "루틴 상세",
		"pathPattern": "/routines/[routineId]",
		"subject": "page:routines:detail",
		"description": "루틴 상세 정보를 확인합니다."
	},
	{
		"groupId": "routines",
		"groupLabel": "루틴",
		"pageId": "routines:edit",
		"pageLabel": "루틴 수정",
		"pathPattern": "/routines/[routineId]/edit",
		"subject": "page:routines:edit",
		"description": "루틴 정보를 수정합니다."
	},
	{
		"groupId": "templates",
		"groupLabel": "템플릿",
		"pageId": "templates:list",
		"pageLabel": "템플릿 목록",
		"pathPattern": "/templates",
		"subject": "page:templates:list",
		"description": "템플릿 목록을 조회합니다.",
		"menuLeafId": "templates-list"
	},
	{
		"groupId": "templates",
		"groupLabel": "템플릿",
		"pageId": "templates:new",
		"pageLabel": "템플릿 등록",
		"pathPattern": "/templates/new",
		"subject": "page:templates:new",
		"description": "새 템플릿을 등록합니다."
	},
	{
		"groupId": "templates",
		"groupLabel": "템플릿",
		"pageId": "templates:detail",
		"pageLabel": "템플릿 상세",
		"pathPattern": "/templates/[templateId]",
		"subject": "page:templates:detail",
		"description": "템플릿 상세 정보를 확인합니다."
	},
	{
		"groupId": "templates",
		"groupLabel": "템플릿",
		"pageId": "templates:edit",
		"pageLabel": "템플릿 수정",
		"pathPattern": "/templates/[templateId]/edit",
		"subject": "page:templates:edit",
		"description": "템플릿 정보를 수정합니다."
	},
	{
		"groupId": "assets",
		"groupLabel": "에셋",
		"pageId": "assets:list",
		"pageLabel": "에셋 목록",
		"pathPattern": "/assets",
		"subject": "page:assets:list",
		"description": "에셋 목록을 조회합니다.",
		"menuLeafId": "assets-list"
	},
	{
		"groupId": "assets",
		"groupLabel": "에셋",
		"pageId": "assets:detail",
		"pageLabel": "에셋 상세",
		"pathPattern": "/assets/[assetId]",
		"subject": "page:assets:detail",
		"description": "에셋 상세 정보를 확인합니다."
	},
	{
		"groupId": "inquiries",
		"groupLabel": "문의 관리",
		"pageId": "inquiries:list",
		"pageLabel": "문의 목록",
		"pathPattern": "/inquiries",
		"subject": "page:inquiries:list",
		"description": "문의 목록을 조회합니다.",
		"menuLeafId": "inquiries-list"
	},
	{
		"groupId": "inquiries",
		"groupLabel": "문의 관리",
		"pageId": "inquiries:new",
		"pageLabel": "문의 등록",
		"pathPattern": "/inquiries/new",
		"subject": "page:inquiries:new",
		"description": "새 문의를 등록합니다."
	},
	{
		"groupId": "inquiries",
		"groupLabel": "문의 관리",
		"pageId": "inquiries:detail",
		"pageLabel": "문의 상세",
		"pathPattern": "/inquiries/[inquiryId]",
		"subject": "page:inquiries:detail",
		"description": "문의 상세 내용을 확인합니다."
	},
	{
		"groupId": "inquiries",
		"groupLabel": "문의 관리",
		"pageId": "inquiries:edit",
		"pageLabel": "문의 수정",
		"pathPattern": "/inquiries/[inquiryId]/edit",
		"subject": "page:inquiries:edit",
		"description": "문의 정보를 수정합니다."
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "roles:list",
		"pageLabel": "역할 목록",
		"pathPattern": "/roles",
		"subject": "page:roles:list",
		"description": "역할 목록을 조회합니다.",
		"menuLeafId": "roles-list"
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "roles:new",
		"pageLabel": "역할 등록",
		"pathPattern": "/roles/new",
		"subject": "page:roles:new",
		"description": "새 역할을 등록합니다."
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "roles:detail",
		"pageLabel": "역할 상세",
		"pathPattern": "/roles/[roleId]",
		"subject": "page:roles:detail",
		"description": "역할 상세 정보를 확인합니다."
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "roles:edit",
		"pageLabel": "역할 수정",
		"pathPattern": "/roles/[roleId]/edit",
		"subject": "page:roles:edit",
		"description": "역할 정보를 수정합니다."
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "abilities:list",
		"pageLabel": "권한 정의 목록",
		"pathPattern": "/abilities",
		"subject": "page:abilities:list",
		"description": "권한 정의 목록을 조회합니다.",
		"menuLeafId": "abilities-list"
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "abilities:new",
		"pageLabel": "권한 정의 등록",
		"pathPattern": "/abilities/new",
		"subject": "page:abilities:new",
		"description": "새 권한 정의를 등록합니다."
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "abilities:detail",
		"pageLabel": "권한 정의 상세",
		"pathPattern": "/abilities/[abilityId]",
		"subject": "page:abilities:detail",
		"description": "권한 정의 상세 정보를 확인합니다."
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "abilities:edit",
		"pageLabel": "권한 정의 수정",
		"pathPattern": "/abilities/[abilityId]/edit",
		"subject": "page:abilities:edit",
		"description": "권한 정의를 수정합니다."
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "actions:list",
		"pageLabel": "액션 목록",
		"pathPattern": "/actions",
		"subject": "page:actions:list",
		"description": "액션 목록을 조회합니다.",
		"menuLeafId": "actions-list"
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "actions:new",
		"pageLabel": "액션 등록",
		"pathPattern": "/actions/new",
		"subject": "page:actions:new",
		"description": "새 액션을 등록합니다."
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "actions:detail",
		"pageLabel": "액션 상세",
		"pathPattern": "/actions/[actionId]",
		"subject": "page:actions:detail",
		"description": "액션 상세 정보를 확인합니다."
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "actions:edit",
		"pageLabel": "액션 수정",
		"pathPattern": "/actions/[actionId]/edit",
		"subject": "page:actions:edit",
		"description": "액션 정보를 수정합니다."
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "subjects:list",
		"pageLabel": "대상 목록",
		"pathPattern": "/subjects",
		"subject": "page:subjects:list",
		"description": "대상 목록을 조회합니다.",
		"menuLeafId": "subjects-list"
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "subjects:detail",
		"pageLabel": "대상 상세",
		"pathPattern": "/subjects/[subjectId]",
		"subject": "page:subjects:detail",
		"description": "대상 상세 정보를 확인합니다."
	},
	{
		"groupId": "tenant-access-requests",
		"groupLabel": "접근 승인",
		"pageId": "tenant-access-requests:list",
		"pageLabel": "접근 신청 목록",
		"pathPattern": "/tenant-access-requests",
		"subject": "page:tenant-access-requests:list",
		"description": "테넌트 접근 신청을 조회하고 검토합니다.",
		"menuLeafId": "tenant-access-requests-list"
	},
	{
		"groupId": "tenant-access-requests",
		"groupLabel": "접근 승인",
		"pageId": "tenant-access-requests:detail",
		"pageLabel": "접근 신청 상세",
		"pathPattern": "/tenant-access-requests/[tenantAccessRequestId]",
		"subject": "page:tenant-access-requests:detail",
		"description": "테넌트 접근 신청 상세를 확인하고 승인 또는 반려합니다."
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "policies:list",
		"pageLabel": "정책 목록",
		"pathPattern": "/policies",
		"subject": "page:policies:list",
		"description": "현재 Space의 권한 정책 목록을 조회합니다.",
		"menuLeafId": "policies-list"
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "policies:new",
		"pageLabel": "정책 등록",
		"pathPattern": "/policies/new",
		"subject": "page:policies:new",
		"description": "현재 Space에 새 권한 정책을 등록합니다."
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "policies:detail",
		"pageLabel": "정책 상세",
		"pathPattern": "/policies/[policyId]",
		"subject": "page:policies:detail",
		"description": "권한 정책 상세와 포함 Ability를 확인합니다."
	},
	{
		"groupId": "roles",
		"groupLabel": "권한 관리",
		"pageId": "policies:edit",
		"pageLabel": "정책 수정",
		"pathPattern": "/policies/[policyId]/edit",
		"subject": "page:policies:edit",
		"description": "권한 정책 기본 정보와 포함 Ability를 수정합니다."
	},
	{
		"groupId": "users",
		"groupLabel": "회원",
		"pageId": "email-verifications:list",
		"pageLabel": "이메일 인증 목록",
		"pathPattern": "/email-verifications",
		"subject": "page:email-verifications:list",
		"description": "회원가입 전 이메일 인증 요청과 발송 상태를 확인합니다.",
		"menuLeafId": "email-verifications-list"
	},
	{
		"groupId": "translations",
		"groupLabel": "다국어",
		"pageId": "translations:list",
		"pageLabel": "정적 번역",
		"pathPattern": "/translations",
		"subject": "page:translations:list",
		"description": "admin과 idp에서 사용하는 정적 다국어 key-value를 관리합니다.",
		"menuLeafId": "translations-list"
	},
	{
		"groupId": "terms",
		"groupLabel": "약관 관리",
		"pageId": "terms:list",
		"pageLabel": "약관 관리",
		"pathPattern": "/terms",
		"subject": "page:terms:list",
		"description": "모바일과 web 서비스에 노출할 약관/동의 문서를 관리합니다.",
		"menuLeafId": "terms-list"
	},
	{
		"groupId": "courses",
		"groupLabel": "수강 관리",
		"pageId": "courses:list",
		"pageLabel": "Course",
		"pathPattern": "/courses",
		"subject": "page:courses:list",
		"description": "무엇을 배우는지와 기본 수강 상품 정책을 관리합니다.",
		"menuLeafId": "courses-list"
	},
	{
		"groupId": "courses",
		"groupLabel": "수강 관리",
		"pageId": "course-offerings:list",
		"pageLabel": "CourseOffering",
		"pathPattern": "/course-offerings",
		"subject": "page:course-offerings:list",
		"description": "실제 개설된 과정/반/기수와 Timeline 연결을 관리합니다.",
		"menuLeafId": "course-offerings-list"
	},
	{
		"groupId": "courses",
		"groupLabel": "수강 관리",
		"pageId": "enrollments:list",
		"pageLabel": "Enrollment",
		"pathPattern": "/enrollments",
		"subject": "page:enrollments:list",
		"description": "결제 후 활성화되는 수강 신청 상태를 관리합니다.",
		"menuLeafId": "enrollments-list"
	},
	{
		"groupId": "courses",
		"groupLabel": "수강 관리",
		"pageId": "course-passes:list",
		"pageLabel": "CoursePass",
		"pathPattern": "/course-passes",
		"subject": "page:course-passes:list",
		"description": "수강권의 유효기간과 잔여 예약 권리를 관리합니다.",
		"menuLeafId": "course-passes-list"
	},
	{
		"groupId": "payments",
		"groupLabel": "결제 관리",
		"pageId": "payments:list",
		"pageLabel": "Payment",
		"pathPattern": "/payments",
		"subject": "page:payments:list",
		"description": "Course와 Product 등 여러 서비스의 Space-scoped 결제 원장을 관리합니다.",
		"menuLeafId": "payments-list"
	},
	{
		"groupId": "settings-auth",
		"groupLabel": "인증 설정",
		"pageId": "settings-auth:dashboard",
		"pageLabel": "인증 대시보드",
		"pathPattern": "/settings/auth",
		"subject": "page:settings-auth:dashboard",
		"description": "인증 운영 현황과 OIDC 관리 지표를 확인합니다.",
		"menuLeafId": "settings-auth-dashboard"
	},
	{
		"groupId": "settings-auth",
		"groupLabel": "인증 설정",
		"pageId": "settings-auth:accounts",
		"pageLabel": "계정",
		"pathPattern": "/settings/auth/accounts",
		"subject": "page:settings-auth:accounts",
		"description": "인증 계정 상태와 잠금 정보를 관리합니다.",
		"menuLeafId": "settings-auth-accounts"
	},
	{
		"groupId": "settings-auth",
		"groupLabel": "인증 설정",
		"pageId": "settings-auth:accounts:detail",
		"pageLabel": "계정 상세",
		"pathPattern": "/settings/auth/accounts/[userId]",
		"subject": "page:settings-auth:accounts:detail",
		"description": "인증 계정 상세와 접근 권한을 확인합니다.",
		"menuLeafId": "settings-auth-accounts"
	},
	{
		"groupId": "settings-auth",
		"groupLabel": "인증 설정",
		"pageId": "settings-auth:oidc-clients",
		"pageLabel": "OIDC 클라이언트",
		"pathPattern": "/settings/auth/oidc-clients",
		"subject": "page:settings-auth:oidc-clients",
		"description": "OIDC 클라이언트 등록과 redirect 설정을 관리합니다.",
		"menuLeafId": "settings-auth-oidc-clients"
	},
	{
		"groupId": "settings-auth",
		"groupLabel": "인증 설정",
		"pageId": "settings-auth:oidc-clients:new",
		"pageLabel": "OIDC 클라이언트 등록",
		"pathPattern": "/settings/auth/oidc-clients/new",
		"subject": "page:settings-auth:oidc-clients:new",
		"description": "새 OIDC 클라이언트를 등록합니다.",
		"menuLeafId": "settings-auth-oidc-clients"
	},
	{
		"groupId": "settings-auth",
		"groupLabel": "인증 설정",
		"pageId": "settings-auth:oidc-clients:detail",
		"pageLabel": "OIDC 클라이언트 상세",
		"pathPattern": "/settings/auth/oidc-clients/[oidcClientId]",
		"subject": "page:settings-auth:oidc-clients:detail",
		"description": "OIDC 클라이언트 상세 설정을 확인합니다.",
		"menuLeafId": "settings-auth-oidc-clients"
	},
	{
		"groupId": "settings-auth",
		"groupLabel": "인증 설정",
		"pageId": "settings-auth:oidc-clients:edit",
		"pageLabel": "OIDC 클라이언트 수정",
		"pathPattern": "/settings/auth/oidc-clients/[oidcClientId]/edit",
		"subject": "page:settings-auth:oidc-clients:edit",
		"description": "OIDC 클라이언트 설정을 수정합니다.",
		"menuLeafId": "settings-auth-oidc-clients"
	},
	{
		"groupId": "settings-auth",
		"groupLabel": "인증 설정",
		"pageId": "settings-auth:oidc-sessions",
		"pageLabel": "OIDC 세션",
		"pathPattern": "/settings/auth/oidc-sessions",
		"subject": "page:settings-auth:oidc-sessions",
		"description": "OIDC 세션 상태와 만료 정보를 확인합니다.",
		"menuLeafId": "settings-auth-oidc-sessions"
	},
	{
		"groupId": "settings-auth",
		"groupLabel": "인증 설정",
		"pageId": "settings-auth:audit-logs",
		"pageLabel": "인증 감사 로그",
		"pathPattern": "/settings/auth/audit-logs",
		"subject": "page:settings-auth:audit-logs",
		"description": "인증 이벤트와 감사 로그를 조회합니다.",
		"menuLeafId": "settings-auth-audit-logs"
	},
	{
		"groupId": "settings-auth",
		"groupLabel": "인증 설정",
		"pageId": "settings-auth:security-policy",
		"pageLabel": "보안 정책",
		"pathPattern": "/settings/auth/security-policy",
		"subject": "page:settings-auth:security-policy",
		"description": "로그인 잠금과 비밀번호 정책을 관리합니다.",
		"menuLeafId": "settings-auth-security-policy"
	}
];
