// Enum imports
import { RoleCategoryNames, RoleGroupNames } from "@cocrepo/enum";

// 시드 데이터를 위한 메타데이터
export interface UserSeedData {
	email: string;
	phone: string;
	password: string;
	profile: {
		name: string;
		nickname: string;
	};
	role?: "USER" | "ADMIN" | "SUPER_ADMIN";
}

export interface GroundSeedData {
	name: string;
	label: string;
	address: string;
	phone: string;
	email: string;
	businessNo: string;
}

// 10명의 다양한 역할 유저 데이터 (SUPER_ADMIN 1명, ADMIN 3명, USER 6명)
export const userSeedData: UserSeedData[] = [
	// SUPER_ADMIN 1명 - 본사 대표
	{
		email: "ceo@f45training.co.kr",
		phone: "01012345678",
		password: "SuperAdmin123!@#",
		profile: {
			name: "김대표",
			nickname: "대표님",
		},
		role: "SUPER_ADMIN",
	},
	// ADMIN 3명 - 각 지점 관리자
	{
		email: "manager.gwanghwamun@f45.kr",
		phone: "01023456789",
		password: "Admin123!@#",
		profile: {
			name: "이점장",
			nickname: "광화문점장",
		},
		role: "ADMIN",
	},
	{
		email: "manager.gangnam@f45.kr",
		phone: "01034567890",
		password: "Admin123!@#",
		profile: {
			name: "박매니저",
			nickname: "강남매니저",
		},
		role: "ADMIN",
	},
	{
		email: "manager.itaewon@crossfit.kr",
		phone: "01045678901",
		password: "Admin123!@#",
		profile: {
			name: "최코치",
			nickname: "이태원코치",
		},
		role: "ADMIN",
	},
	// USER 6명 - 실제 회원들
	{
		email: "minsu.kim92@gmail.com",
		phone: "01056789012",
		password: "User123!@#",
		profile: {
			name: "김민수",
			nickname: "민수",
		},
		role: "USER",
	},
	{
		email: "seoyeon_lee@naver.com",
		phone: "01067890123",
		password: "User123!@#",
		profile: {
			name: "이서연",
			nickname: "서연",
		},
		role: "USER",
	},
	{
		email: "yejun.park@kakao.com",
		phone: "01078901234",
		password: "User123!@#",
		profile: {
			name: "박예준",
			nickname: "예준",
		},
		role: "USER",
	},
	{
		email: "jiwoo0315@gmail.com",
		phone: "01089012345",
		password: "User123!@#",
		profile: {
			name: "최지우",
			nickname: "지우",
		},
		role: "USER",
	},
	{
		email: "hayoon.jung@naver.com",
		phone: "01090123456",
		password: "User123!@#",
		profile: {
			name: "정하윤",
			nickname: "하윤",
		},
		role: "USER",
	},
	{
		email: "doyoon.kang@gmail.com",
		phone: "01001234567",
		password: "User123!@#",
		profile: {
			name: "강도윤",
			nickname: "도윤",
		},
		role: "USER",
	},
];

// 현실적인 피트니스 센터 그라운드 데이터 (10개)
export const groundSeedData: GroundSeedData[] = [
	// F45 Training 지점들
	{
		name: "F45 광화문",
		label: "본점",
		address: "서울시 종로구 세종대로 175 광화문D타워 B1",
		phone: "02-1234-5678",
		email: "gwanghwamun@f45training.co.kr",
		businessNo: "101-86-12345",
	},
	{
		name: "F45 강남1호",
		label: "지점",
		address: "서울시 강남구 테헤란로 152 강남파이낸스센터 B2",
		phone: "02-2345-6789",
		email: "gangnam1@f45training.co.kr",
		businessNo: "102-86-23456",
	},
	{
		name: "F45 삼성",
		label: "지점",
		address: "서울시 강남구 삼성로 512 삼성타워 B1",
		phone: "02-3456-7890",
		email: "samsung@f45training.co.kr",
		businessNo: "103-86-34567",
	},
	{
		name: "F45 잠실",
		label: "지점",
		address: "서울시 송파구 올림픽로 300 롯데월드타워 B2",
		phone: "02-4567-8901",
		email: "jamsil@f45training.co.kr",
		businessNo: "104-86-45678",
	},
	// 크로스핏 박스들
	{
		name: "크로스핏 이태원",
		label: "본점",
		address: "서울시 용산구 이태원로 200 크로스핏빌딩 2층",
		phone: "02-5678-9012",
		email: "itaewon@crossfit.kr",
		businessNo: "201-87-56789",
	},
	{
		name: "크로스핏 마포",
		label: "지점",
		address: "서울시 마포구 양화로 45 메세나폴리스 B1",
		phone: "02-6789-0123",
		email: "mapo@crossfit.kr",
		businessNo: "202-87-67890",
	},
	// 애니타임 피트니스
	{
		name: "애니타임피트니스 역삼",
		label: "본점",
		address: "서울시 강남구 역삼로 134 역삼빌딩 3층",
		phone: "02-7890-1234",
		email: "yeoksam@anytimefitness.kr",
		businessNo: "301-88-78901",
	},
	{
		name: "애니타임피트니스 신논현",
		label: "지점",
		address: "서울시 강남구 강남대로 472 신논현타워 4층",
		phone: "02-8901-2345",
		email: "sinnonhyeon@anytimefitness.kr",
		businessNo: "302-88-89012",
	},
	// 스포애니
	{
		name: "스포애니 홍대",
		label: "본점",
		address: "서울시 마포구 홍익로 25 홍대스포츠센터 2층",
		phone: "02-9012-3456",
		email: "hongdae@spoany.co.kr",
		businessNo: "401-89-90123",
	},
	{
		name: "스포애니 건대",
		label: "지점",
		address: "서울시 광진구 능동로 120 건대입구역빌딩 B1",
		phone: "02-0123-4567",
		email: "kondae@spoany.co.kr",
		businessNo: "402-89-01234",
	},
];

// Role 타입 카테고리 시드 데이터 (RoleCategoryNames enum 활용)
export interface CategorySeedData {
	roleCategoryEnum: RoleCategoryNames;
	type: "Role" | "Space" | "File" | "User";
	parentId?: string;
}

export const roleCategorySeedData: CategorySeedData[] = [
	{
		roleCategoryEnum: RoleCategoryNames.COMMON,
		type: "Role",
	},
	{
		roleCategoryEnum: RoleCategoryNames.USER,
		type: "Role",
	},
	{
		roleCategoryEnum: RoleCategoryNames.ADMIN,
		type: "Role",
	},
	{
		roleCategoryEnum: RoleCategoryNames.MANAGER,
		type: "Role",
	},
];

// Role 시드 데이터 (role.prisma의 Role 모델에 대응)
export interface RoleSeedData {
	name: "USER" | "ADMIN" | "SUPER_ADMIN";
}

export const roleSeedData: RoleSeedData[] = [
	{
		name: "SUPER_ADMIN",
	},
	{
		name: "ADMIN",
	},
	{
		name: "USER",
	},
];

// RoleClassification 시드 데이터 (Role과 Category type="Role" 연결)
// role.prisma의 RoleClassification 모델: categoryId, roleId로 연결

export interface RoleClassificationSeedData {
	roleName: "USER" | "ADMIN" | "SUPER_ADMIN";
	roleCategoryEnum: RoleCategoryNames; // RoleCategoryNames enum 사용
}

export const roleClassificationSeedData: RoleClassificationSeedData[] = [
	{
		roleName: "SUPER_ADMIN",
		roleCategoryEnum: RoleCategoryNames.COMMON, // "공통" 카테고리
	},
	{
		roleName: "ADMIN",
		roleCategoryEnum: RoleCategoryNames.ADMIN, // "운영자" 카테고리
	},
	{
		roleName: "USER",
		roleCategoryEnum: RoleCategoryNames.USER, // "유저" 카테고리
	},
];

// Role Group 시드 데이터 (RoleGroupNames enum 활용)

export interface RoleGroupSeedData {
	roleGroupEnum: RoleGroupNames;
}

export const roleGroupSeedData: RoleGroupSeedData[] = [
	{
		roleGroupEnum: RoleGroupNames.NORMAL,
	},
	{
		roleGroupEnum: RoleGroupNames.VIP,
	},
];

// Role과 Group 연결 (RoleAssociation) 시드 데이터
export interface RoleAssociationSeedData {
	roleName: "USER" | "ADMIN" | "SUPER_ADMIN";
	roleGroupEnum: RoleGroupNames;
}

export const roleAssociationSeedData: RoleAssociationSeedData[] = [
	// SUPER_ADMIN은 VIP 그룹
	{
		roleName: "SUPER_ADMIN",
		roleGroupEnum: RoleGroupNames.VIP,
	},
	// ADMIN은 VIP 그룹
	{
		roleName: "ADMIN",
		roleGroupEnum: RoleGroupNames.VIP,
	},
	// USER는 NORMAL 그룹
	{
		roleName: "USER",
		roleGroupEnum: RoleGroupNames.NORMAL,
	},
];

// 유저-그라운드 매핑 인터페이스
export interface UserGroundMappingData {
	userEmail: string;
	groundNames: string[];
}

// 유저와 그라운드 매핑 (정합성 보장 - 역할에 맞는 논리적 연결)
export const userGroundMapping: UserGroundMappingData[] = [
	// SUPER_ADMIN - 모든 지점 접근 가능
	{
		userEmail: "ceo@f45training.co.kr",
		groundNames: [
			"F45 광화문",
			"F45 강남1호",
			"F45 삼성",
			"F45 잠실",
			"크로스핏 이태원",
			"크로스핏 마포",
			"애니타임피트니스 역삼",
			"애니타임피트니스 신논현",
			"스포애니 홍대",
			"스포애니 건대",
		],
	},
	// ADMIN - 담당 지점만 (F45 계열)
	{
		userEmail: "manager.gwanghwamun@f45.kr",
		groundNames: ["F45 광화문"],
	},
	{
		userEmail: "manager.gangnam@f45.kr",
		groundNames: ["F45 강남1호", "F45 삼성"], // 강남 지역 담당
	},
	// ADMIN - 크로스핏 담당
	{
		userEmail: "manager.itaewon@crossfit.kr",
		groundNames: ["크로스핏 이태원", "크로스핏 마포"],
	},
	// USER - 가입한 지점 (일반 회원)
	{
		userEmail: "minsu.kim92@gmail.com",
		groundNames: ["F45 광화문"], // 광화문 회원
	},
	{
		userEmail: "seoyeon_lee@naver.com",
		groundNames: ["F45 강남1호"], // 강남 회원
	},
	{
		userEmail: "yejun.park@kakao.com",
		groundNames: ["크로스핏 이태원"], // 크로스핏 회원
	},
	{
		userEmail: "jiwoo0315@gmail.com",
		groundNames: ["애니타임피트니스 역삼", "애니타임피트니스 신논현"], // 다중 지점 회원
	},
	{
		userEmail: "hayoon.jung@naver.com",
		groundNames: ["스포애니 홍대"], // 스포애니 회원
	},
	{
		userEmail: "doyoon.kang@gmail.com",
		groundNames: ["F45 잠실", "스포애니 건대"], // 다중 브랜드 회원 (엣지 케이스)
	},
];

// ============================================================
// Agreement (약관) 시드 데이터
// ============================================================

export type AgreementType =
	| "TERMS_OF_SERVICE"
	| "PRIVACY_POLICY"
	| "MARKETING_CONSENT"
	| "LOCATION_CONSENT"
	| "THIRD_PARTY_SHARING";

export interface AgreementSeedData {
	title: string;
	type: AgreementType;
	version: string;
	isRequired: boolean;
	content: string;
}

export const agreementSeedData: AgreementSeedData[] = [
	{
		title: "서비스 이용약관",
		type: "TERMS_OF_SERVICE",
		version: "1.0.0",
		isRequired: true,
		content: `제1조 (목적)
이 약관은 F45 Training Korea(이하 "회사")가 제공하는 피트니스 서비스의 이용조건 및 절차에 관한 사항을 규정함을 목적으로 합니다.

제2조 (용어의 정의)
1. "서비스"란 회사가 제공하는 피트니스 관련 서비스를 말합니다.
2. "회원"이란 이 약관에 동의하고 서비스를 이용하는 자를 말합니다.

제3조 (약관의 효력 및 변경)
1. 이 약관은 서비스를 이용하고자 하는 모든 회원에게 적용됩니다.
2. 회사는 관련 법령을 위배하지 않는 범위에서 이 약관을 개정할 수 있습니다.`,
	},
	{
		title: "개인정보 처리방침",
		type: "PRIVACY_POLICY",
		version: "1.0.0",
		isRequired: true,
		content: `1. 개인정보의 수집 및 이용 목적
회사는 다음의 목적을 위해 개인정보를 수집 및 이용합니다.
- 회원 가입 및 관리
- 서비스 제공 및 계약 이행
- 고객 상담 및 불만 처리

2. 수집하는 개인정보 항목
- 필수항목: 이름, 이메일, 휴대폰 번호
- 선택항목: 생년월일, 성별

3. 개인정보의 보유 및 이용기간
회원 탈퇴 시까지 (단, 관련 법령에 따라 보존이 필요한 경우 해당 기간)`,
	},
	{
		title: "마케팅 정보 수신 동의",
		type: "MARKETING_CONSENT",
		version: "1.0.0",
		isRequired: false,
		content: `마케팅 정보 수신에 동의하시면 다음과 같은 혜택을 받으실 수 있습니다.

1. 수신 정보
- 신규 프로그램 및 이벤트 안내
- 프로모션 및 할인 정보
- 피트니스 팁 및 건강 정보

2. 수신 방법
- SMS/MMS
- 이메일
- 앱 푸시 알림

※ 동의하지 않아도 서비스 이용에는 제한이 없습니다.
※ 동의 후에도 언제든지 수신 거부할 수 있습니다.`,
	},
	{
		title: "위치 기반 서비스 이용약관",
		type: "LOCATION_CONSENT",
		version: "1.0.0",
		isRequired: false,
		content: `1. 위치정보의 수집 목적
- 가까운 지점 안내
- 출석 체크 (지점 방문 확인)

2. 위치정보의 보유기간
- 서비스 이용 중에만 수집되며, 목적 달성 후 즉시 파기됩니다.

3. 위치정보 수집 거부권
- 위치정보 수집에 동의하지 않아도 기본 서비스 이용이 가능합니다.
- 다만, 위치 기반 서비스(가까운 지점 찾기 등)는 이용이 제한됩니다.`,
	},
];

// 유저-약관동의 매핑 인터페이스
export interface UserAgreementMappingData {
	userEmail: string;
	agreements: AgreementType[];
}

// 유저와 약관 동의 매핑 (정합성 보장)
export const userAgreementMapping: UserAgreementMappingData[] = [
	// SUPER_ADMIN - 모든 약관 동의
	{
		userEmail: "ceo@f45training.co.kr",
		agreements: [
			"TERMS_OF_SERVICE",
			"PRIVACY_POLICY",
			"MARKETING_CONSENT",
			"LOCATION_CONSENT",
		],
	},
	// ADMIN들 - 필수 + 마케팅 동의
	{
		userEmail: "manager.gwanghwamun@f45.kr",
		agreements: ["TERMS_OF_SERVICE", "PRIVACY_POLICY", "MARKETING_CONSENT"],
	},
	{
		userEmail: "manager.gangnam@f45.kr",
		agreements: ["TERMS_OF_SERVICE", "PRIVACY_POLICY", "MARKETING_CONSENT"],
	},
	{
		userEmail: "manager.itaewon@crossfit.kr",
		agreements: ["TERMS_OF_SERVICE", "PRIVACY_POLICY", "LOCATION_CONSENT"],
	},
	// USER들 - 다양한 동의 패턴 (테스트 시나리오)
	{
		userEmail: "minsu.kim92@gmail.com",
		agreements: [
			"TERMS_OF_SERVICE",
			"PRIVACY_POLICY",
			"MARKETING_CONSENT",
			"LOCATION_CONSENT",
		], // 모든 동의
	},
	{
		userEmail: "seoyeon_lee@naver.com",
		agreements: ["TERMS_OF_SERVICE", "PRIVACY_POLICY"], // 필수만 동의
	},
	{
		userEmail: "yejun.park@kakao.com",
		agreements: ["TERMS_OF_SERVICE", "PRIVACY_POLICY", "MARKETING_CONSENT"], // 마케팅만 추가
	},
	{
		userEmail: "jiwoo0315@gmail.com",
		agreements: ["TERMS_OF_SERVICE", "PRIVACY_POLICY", "LOCATION_CONSENT"], // 위치만 추가
	},
	{
		userEmail: "hayoon.jung@naver.com",
		agreements: ["TERMS_OF_SERVICE", "PRIVACY_POLICY"], // 필수만 동의
	},
	{
		userEmail: "doyoon.kang@gmail.com",
		agreements: [
			"TERMS_OF_SERVICE",
			"PRIVACY_POLICY",
			"MARKETING_CONSENT",
			"LOCATION_CONSENT",
		], // 모든 동의
	},
];

// ============================================================================
// Subject (CASL 권한 대상) 시드 데이터
// ============================================================================

/**
 * SubjectTypes enum (core.prisma 기준)
 * - Menu: 메뉴 접근 권한
 * - Feature: 기능 권한 (내보내기, 가져오기 등)
 * - Entity: 엔티티 CRUD 권한
 * - API: API 엔드포인트 권한
 * - Column: 컬럼 가시성 권한
 */
export type SubjectType = "Menu" | "Feature" | "Entity" | "API" | "Column";

export interface SubjectSeedData {
	name: string;
	type: SubjectType;
	label: string;
	description: string;
	sortOrder: number;
	parentName?: string; // 부모 Subject의 name (시드 실행 시 동적 연결)
}

/**
 * Menu Subject 시드 데이터
 * - 계층 구조를 가진 메뉴 권한 정의
 * - parentName을 통해 부모-자식 관계 설정
 * - 기획서: .claude/plans/2025-12-30-AdminLayoutAndMenuSystem.md (v5.0)
 */
export const menuSubjectSeedData: SubjectSeedData[] = [
	// 대시보드 (최상위, 하위 없음)
	{
		name: "menu:dashboard",
		type: "Menu",
		label: "대시보드",
		description: "대시보드 메뉴 접근 권한",
		sortOrder: 0,
	},
	// 사용자 (부모)
	{
		name: "menu:users",
		type: "Menu",
		label: "사용자",
		description: "사용자 관리 메뉴 접근 권한",
		sortOrder: 10,
	},
	// 사용자 - 하위 메뉴
	{
		name: "menu:users:list",
		type: "Menu",
		label: "사용자 목록",
		description: "사용자 목록 조회 권한",
		sortOrder: 11,
		parentName: "menu:users",
	},
	{
		name: "menu:users:profiles",
		type: "Menu",
		label: "프로필 관리",
		description: "프로필 관리 권한",
		sortOrder: 12,
		parentName: "menu:users",
	},
	{
		name: "menu:users:categories",
		type: "Menu",
		label: "분류 관리",
		description: "사용자 분류 관리 권한",
		sortOrder: 13,
		parentName: "menu:users",
	},
	{
		name: "menu:users:groups",
		type: "Menu",
		label: "그룹 관리",
		description: "사용자 그룹 관리 권한",
		sortOrder: 14,
		parentName: "menu:users",
	},
	// 일정 (부모)
	{
		name: "menu:schedules",
		type: "Menu",
		label: "일정",
		description: "일정 관리 메뉴 접근 권한",
		sortOrder: 20,
	},
	// 일정 - 하위 메뉴
	{
		name: "menu:schedules:timelines",
		type: "Menu",
		label: "타임라인",
		description: "타임라인 관리 권한",
		sortOrder: 21,
		parentName: "menu:schedules",
	},
	{
		name: "menu:schedules:sessions",
		type: "Menu",
		label: "세션",
		description: "세션 관리 권한",
		sortOrder: 22,
		parentName: "menu:schedules",
	},
	{
		name: "menu:schedules:programs",
		type: "Menu",
		label: "프로그램",
		description: "프로그램 관리 권한",
		sortOrder: 23,
		parentName: "menu:schedules",
	},
	{
		name: "menu:schedules:routines",
		type: "Menu",
		label: "루틴",
		description: "루틴 관리 권한",
		sortOrder: 24,
		parentName: "menu:schedules",
	},
	// 파일 (부모)
	{
		name: "menu:files",
		type: "Menu",
		label: "파일",
		description: "파일 관리 메뉴 접근 권한",
		sortOrder: 30,
	},
	// 파일 - 하위 메뉴
	{
		name: "menu:files:list",
		type: "Menu",
		label: "파일 목록",
		description: "파일 목록 조회 권한",
		sortOrder: 31,
		parentName: "menu:files",
	},
	{
		name: "menu:files:categories",
		type: "Menu",
		label: "분류 관리",
		description: "파일 분류 관리 권한",
		sortOrder: 32,
		parentName: "menu:files",
	},
	// 콘텐츠 (부모)
	{
		name: "menu:contents",
		type: "Menu",
		label: "콘텐츠",
		description: "콘텐츠 관리 메뉴 접근 권한",
		sortOrder: 40,
	},
	// 콘텐츠 - 하위 메뉴
	{
		name: "menu:contents:posts",
		type: "Menu",
		label: "게시물",
		description: "게시물 관리 권한",
		sortOrder: 41,
		parentName: "menu:contents",
	},
	{
		name: "menu:contents:list",
		type: "Menu",
		label: "콘텐츠 목록",
		description: "콘텐츠 목록 조회 권한",
		sortOrder: 42,
		parentName: "menu:contents",
	},
	// 지갑 (부모)
	{
		name: "menu:wallets",
		type: "Menu",
		label: "지갑",
		description: "지갑 관리 메뉴 접근 권한",
		sortOrder: 50,
	},
	// 지갑 - 하위 메뉴
	{
		name: "menu:wallets:list",
		type: "Menu",
		label: "지갑 목록",
		description: "지갑 목록 조회 권한",
		sortOrder: 51,
		parentName: "menu:wallets",
	},
	{
		name: "menu:wallets:transactions",
		type: "Menu",
		label: "트랜잭션",
		description: "트랜잭션 조회 권한",
		sortOrder: 52,
		parentName: "menu:wallets",
	},
	// 설정 (부모)
	{
		name: "menu:settings",
		type: "Menu",
		label: "설정",
		description: "설정 메뉴 접근 권한",
		sortOrder: 100,
	},
	// 설정 - 하위 메뉴
	{
		name: "menu:settings:ground",
		type: "Menu",
		label: "Ground 정보",
		description: "Ground 정보 관리 권한",
		sortOrder: 101,
		parentName: "menu:settings",
	},
	{
		name: "menu:settings:roles",
		type: "Menu",
		label: "역할 관리",
		description: "역할 관리 권한",
		sortOrder: 102,
		parentName: "menu:settings",
	},
	{
		name: "menu:settings:abilities",
		type: "Menu",
		label: "권한 관리",
		description: "권한 관리 메뉴 접근 권한 (SUPER_ADMIN 전용)",
		sortOrder: 103,
		parentName: "menu:settings",
	},
	{
		name: "menu:settings:tenants",
		type: "Menu",
		label: "테넌트 관리",
		description: "테넌트 관리 권한 (SUPER_ADMIN 전용)",
		sortOrder: 104,
		parentName: "menu:settings",
	},
	{
		name: "menu:settings:ui-configs",
		type: "Menu",
		label: "UI 설정",
		description: "UI 설정 관리 권한",
		sortOrder: 105,
		parentName: "menu:settings",
	},
];

/**
 * Feature Subject 시드 데이터
 * - 기능별 권한 정의 (내보내기, 가져오기, 일괄 삭제 등)
 */
export const featureSubjectSeedData: SubjectSeedData[] = [
	{
		name: "feature:export",
		type: "Feature",
		label: "내보내기",
		description: "데이터 내보내기 기능 권한",
		sortOrder: 200,
	},
	{
		name: "feature:import",
		type: "Feature",
		label: "가져오기",
		description: "데이터 가져오기 기능 권한",
		sortOrder: 201,
	},
	{
		name: "feature:bulk-delete",
		type: "Feature",
		label: "일괄 삭제",
		description: "데이터 일괄 삭제 기능 권한",
		sortOrder: 202,
	},
	{
		name: "feature:send-notification",
		type: "Feature",
		label: "알림 발송",
		description: "알림/푸시 발송 기능 권한",
		sortOrder: 203,
	},
];

/**
 * Entity Subject 시드 데이터
 * - 엔티티별 CRUD 권한 정의
 */
export const entitySubjectSeedData: SubjectSeedData[] = [
	{
		name: "entity:User",
		type: "Entity",
		label: "사용자",
		description: "사용자 엔티티 CRUD 권한",
		sortOrder: 300,
	},
	{
		name: "entity:Ground",
		type: "Entity",
		label: "시설",
		description: "시설 엔티티 CRUD 권한",
		sortOrder: 301,
	},
	{
		name: "entity:Space",
		type: "Entity",
		label: "공간",
		description: "공간 엔티티 CRUD 권한",
		sortOrder: 302,
	},
	{
		name: "entity:Reservation",
		type: "Entity",
		label: "예약",
		description: "예약 엔티티 CRUD 권한",
		sortOrder: 303,
	},
	{
		name: "entity:Content",
		type: "Entity",
		label: "콘텐츠",
		description: "콘텐츠 엔티티 CRUD 권한",
		sortOrder: 304,
	},
	{
		name: "entity:Role",
		type: "Entity",
		label: "역할",
		description: "역할 엔티티 CRUD 권한",
		sortOrder: 305,
	},
	{
		name: "entity:Ability",
		type: "Entity",
		label: "권한",
		description: "권한 엔티티 CRUD 권한",
		sortOrder: 306,
	},
];

/**
 * 모든 Subject 시드 데이터를 하나로 합침
 */
export const subjectSeedData: SubjectSeedData[] = [
	...menuSubjectSeedData,
	...featureSubjectSeedData,
	...entitySubjectSeedData,
];

// ============================================================================
// Ability (CASL 권한 정의) 시드 데이터
// ============================================================================

/**
 * AbilityActions enum (core.prisma 기준)
 * - CREATE: 생성 권한
 * - READ: 조회 권한
 * - UPDATE: 수정 권한
 * - DELETE: 삭제 권한
 * - ACCESS: 접근 권한 (메뉴 등)
 * - MANAGE: 모든 권한 (SUPER_ADMIN용)
 * - EXPORT: 내보내기 권한
 * - IMPORT: 가져오기 권한
 * - APPROVE: 승인 권한
 * - REJECT: 반려 권한
 */
export type AbilityAction =
	| "CREATE"
	| "READ"
	| "UPDATE"
	| "DELETE"
	| "ACCESS"
	| "MANAGE"
	| "EXPORT"
	| "IMPORT"
	| "APPROVE"
	| "REJECT";

/**
 * AbilityTypes enum (core.prisma 기준)
 * - CAN: 허용
 * - CAN_NOT: 금지
 */
export type AbilityType = "CAN" | "CAN_NOT";

export interface AbilitySeedData {
	roleName: "USER" | "ADMIN" | "SUPER_ADMIN";
	subjectName: string; // Subject의 name
	type: AbilityType;
	action: AbilityAction;
	description: string;
	conditions?: Record<string, unknown>; // CASL conditions (예: 자신의 데이터만 접근)
	isActive?: boolean;
}

/**
 * SUPER_ADMIN 권한 시드 데이터
 * - MANAGE all: 모든 권한
 */
export const superAdminAbilitySeedData: AbilitySeedData[] = [
	// 모든 메뉴 MANAGE (1depth)
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:dashboard",
		type: "CAN",
		action: "MANAGE",
		description: "대시보드 전체 관리 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:users",
		type: "CAN",
		action: "MANAGE",
		description: "사용자 관리 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:schedules",
		type: "CAN",
		action: "MANAGE",
		description: "일정 관리 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:files",
		type: "CAN",
		action: "MANAGE",
		description: "파일 관리 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:contents",
		type: "CAN",
		action: "MANAGE",
		description: "콘텐츠 관리 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:wallets",
		type: "CAN",
		action: "MANAGE",
		description: "지갑 관리 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:settings",
		type: "CAN",
		action: "MANAGE",
		description: "설정 관리 전체 권한",
	},
	// 모든 메뉴 MANAGE (2depth - 사용자)
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:users:list",
		type: "CAN",
		action: "MANAGE",
		description: "사용자 목록 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:users:profiles",
		type: "CAN",
		action: "MANAGE",
		description: "프로필 관리 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:users:categories",
		type: "CAN",
		action: "MANAGE",
		description: "사용자 분류 관리 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:users:groups",
		type: "CAN",
		action: "MANAGE",
		description: "그룹 관리 전체 권한",
	},
	// 모든 메뉴 MANAGE (2depth - 일정)
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:schedules:timelines",
		type: "CAN",
		action: "MANAGE",
		description: "타임라인 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:schedules:sessions",
		type: "CAN",
		action: "MANAGE",
		description: "세션 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:schedules:programs",
		type: "CAN",
		action: "MANAGE",
		description: "프로그램 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:schedules:routines",
		type: "CAN",
		action: "MANAGE",
		description: "루틴 전체 권한",
	},
	// 모든 메뉴 MANAGE (2depth - 파일)
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:files:list",
		type: "CAN",
		action: "MANAGE",
		description: "파일 목록 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:files:categories",
		type: "CAN",
		action: "MANAGE",
		description: "파일 분류 관리 전체 권한",
	},
	// 모든 메뉴 MANAGE (2depth - 콘텐츠)
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:contents:posts",
		type: "CAN",
		action: "MANAGE",
		description: "게시물 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:contents:list",
		type: "CAN",
		action: "MANAGE",
		description: "콘텐츠 목록 전체 권한",
	},
	// 모든 메뉴 MANAGE (2depth - 지갑)
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:wallets:list",
		type: "CAN",
		action: "MANAGE",
		description: "지갑 목록 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:wallets:transactions",
		type: "CAN",
		action: "MANAGE",
		description: "트랜잭션 전체 권한",
	},
	// 모든 메뉴 MANAGE (2depth - 설정)
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:settings:ground",
		type: "CAN",
		action: "MANAGE",
		description: "Ground 정보 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:settings:roles",
		type: "CAN",
		action: "MANAGE",
		description: "역할 관리 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:settings:abilities",
		type: "CAN",
		action: "MANAGE",
		description: "권한 관리 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:settings:tenants",
		type: "CAN",
		action: "MANAGE",
		description: "테넌트 관리 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "menu:settings:ui-configs",
		type: "CAN",
		action: "MANAGE",
		description: "UI 설정 전체 권한",
	},
	// 모든 기능 MANAGE
	{
		roleName: "SUPER_ADMIN",
		subjectName: "feature:export",
		type: "CAN",
		action: "MANAGE",
		description: "내보내기 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "feature:import",
		type: "CAN",
		action: "MANAGE",
		description: "가져오기 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "feature:bulk-delete",
		type: "CAN",
		action: "MANAGE",
		description: "일괄 삭제 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "feature:send-notification",
		type: "CAN",
		action: "MANAGE",
		description: "알림 발송 전체 권한",
	},
	// 모든 엔티티 MANAGE
	{
		roleName: "SUPER_ADMIN",
		subjectName: "entity:User",
		type: "CAN",
		action: "MANAGE",
		description: "사용자 엔티티 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "entity:Ground",
		type: "CAN",
		action: "MANAGE",
		description: "시설 엔티티 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "entity:Space",
		type: "CAN",
		action: "MANAGE",
		description: "공간 엔티티 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "entity:Reservation",
		type: "CAN",
		action: "MANAGE",
		description: "예약 엔티티 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "entity:Content",
		type: "CAN",
		action: "MANAGE",
		description: "콘텐츠 엔티티 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "entity:Role",
		type: "CAN",
		action: "MANAGE",
		description: "역할 엔티티 전체 권한",
	},
	{
		roleName: "SUPER_ADMIN",
		subjectName: "entity:Ability",
		type: "CAN",
		action: "MANAGE",
		description: "권한 엔티티 전체 권한",
	},
];

/**
 * ADMIN 권한 시드 데이터
 * - 메뉴 ACCESS: 대시보드, 회원, 예약, 설정(일부)
 * - 엔티티: User, Reservation MANAGE / Ground READ, UPDATE
 * - CAN_NOT: 권한 관리 접근 불가
 */
export const adminAbilitySeedData: AbilitySeedData[] = [
	// 메뉴 ACCESS (1depth)
	{
		roleName: "ADMIN",
		subjectName: "menu:dashboard",
		type: "CAN",
		action: "ACCESS",
		description: "대시보드 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:users",
		type: "CAN",
		action: "ACCESS",
		description: "사용자 관리 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:users:list",
		type: "CAN",
		action: "ACCESS",
		description: "사용자 목록 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:users:profiles",
		type: "CAN",
		action: "ACCESS",
		description: "프로필 관리 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:users:categories",
		type: "CAN",
		action: "ACCESS",
		description: "사용자 분류 관리 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:users:groups",
		type: "CAN",
		action: "ACCESS",
		description: "그룹 관리 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:schedules",
		type: "CAN",
		action: "ACCESS",
		description: "일정 관리 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:schedules:timelines",
		type: "CAN",
		action: "ACCESS",
		description: "타임라인 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:schedules:sessions",
		type: "CAN",
		action: "ACCESS",
		description: "세션 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:schedules:programs",
		type: "CAN",
		action: "ACCESS",
		description: "프로그램 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:schedules:routines",
		type: "CAN",
		action: "ACCESS",
		description: "루틴 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:files",
		type: "CAN",
		action: "ACCESS",
		description: "파일 관리 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:files:list",
		type: "CAN",
		action: "ACCESS",
		description: "파일 목록 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:files:categories",
		type: "CAN",
		action: "ACCESS",
		description: "파일 분류 관리 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:contents",
		type: "CAN",
		action: "ACCESS",
		description: "콘텐츠 관리 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:contents:posts",
		type: "CAN",
		action: "ACCESS",
		description: "게시물 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:contents:list",
		type: "CAN",
		action: "ACCESS",
		description: "콘텐츠 목록 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:wallets",
		type: "CAN",
		action: "ACCESS",
		description: "지갑 관리 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:wallets:list",
		type: "CAN",
		action: "ACCESS",
		description: "지갑 목록 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:wallets:transactions",
		type: "CAN",
		action: "ACCESS",
		description: "트랜잭션 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:settings",
		type: "CAN",
		action: "ACCESS",
		description: "설정 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:settings:ground",
		type: "CAN",
		action: "ACCESS",
		description: "Ground 정보 접근 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:settings:ui-configs",
		type: "CAN",
		action: "ACCESS",
		description: "UI 설정 접근 권한",
	},
	// 권한 관리 접근 불가 (CAN_NOT)
	{
		roleName: "ADMIN",
		subjectName: "menu:settings:roles",
		type: "CAN_NOT",
		action: "ACCESS",
		description: "역할 관리 접근 불가",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:settings:abilities",
		type: "CAN_NOT",
		action: "ACCESS",
		description: "권한 관리 접근 불가",
	},
	{
		roleName: "ADMIN",
		subjectName: "menu:settings:tenants",
		type: "CAN_NOT",
		action: "ACCESS",
		description: "테넌트 관리 접근 불가",
	},
	// 엔티티 권한
	{
		roleName: "ADMIN",
		subjectName: "entity:User",
		type: "CAN",
		action: "MANAGE",
		description: "사용자 엔티티 관리 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "entity:Reservation",
		type: "CAN",
		action: "MANAGE",
		description: "예약 엔티티 관리 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "entity:Ground",
		type: "CAN",
		action: "READ",
		description: "시설 조회 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "entity:Ground",
		type: "CAN",
		action: "UPDATE",
		description: "시설 수정 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "entity:Content",
		type: "CAN",
		action: "MANAGE",
		description: "콘텐츠 관리 권한",
	},
	// 기능 권한
	{
		roleName: "ADMIN",
		subjectName: "feature:export",
		type: "CAN",
		action: "ACCESS",
		description: "내보내기 권한",
	},
	{
		roleName: "ADMIN",
		subjectName: "feature:send-notification",
		type: "CAN",
		action: "ACCESS",
		description: "알림 발송 권한",
	},
	// 일괄 삭제 불가
	{
		roleName: "ADMIN",
		subjectName: "feature:bulk-delete",
		type: "CAN_NOT",
		action: "ACCESS",
		description: "일괄 삭제 불가",
	},
];

/**
 * USER 권한 시드 데이터
 * - 자신의 데이터만 READ, UPDATE 가능 (conditions 사용)
 * - 자신의 예약만 CREATE, READ 가능
 */
export const userAbilitySeedData: AbilitySeedData[] = [
	// 자신의 User 정보만 조회/수정 가능
	{
		roleName: "USER",
		subjectName: "entity:User",
		type: "CAN",
		action: "READ",
		description: "자신의 사용자 정보 조회 권한",
		conditions: { id: "{{ user.id }}" },
	},
	{
		roleName: "USER",
		subjectName: "entity:User",
		type: "CAN",
		action: "UPDATE",
		description: "자신의 사용자 정보 수정 권한",
		conditions: { id: "{{ user.id }}" },
	},
	// 자신의 예약만 생성/조회 가능
	{
		roleName: "USER",
		subjectName: "entity:Reservation",
		type: "CAN",
		action: "CREATE",
		description: "예약 생성 권한",
	},
	{
		roleName: "USER",
		subjectName: "entity:Reservation",
		type: "CAN",
		action: "READ",
		description: "자신의 예약 조회 권한",
		conditions: { userId: "{{ user.id }}" },
	},
	{
		roleName: "USER",
		subjectName: "entity:Reservation",
		type: "CAN",
		action: "UPDATE",
		description: "자신의 예약 수정 권한 (취소 등)",
		conditions: { userId: "{{ user.id }}" },
	},
	// 시설 정보 조회
	{
		roleName: "USER",
		subjectName: "entity:Ground",
		type: "CAN",
		action: "READ",
		description: "시설 정보 조회 권한",
	},
	// 콘텐츠 조회
	{
		roleName: "USER",
		subjectName: "entity:Content",
		type: "CAN",
		action: "READ",
		description: "콘텐츠 조회 권한",
	},
];

/**
 * 모든 Ability 시드 데이터를 하나로 합침
 */
export const abilitySeedData: AbilitySeedData[] = [
	...superAdminAbilitySeedData,
	...adminAbilitySeedData,
	...userAbilitySeedData,
];

// ============================================================================
// Role-Subject-Ability 매핑 요약
// ============================================================================

/**
 * 권한 매핑 요약 (문서화용)
 *
 * SUPER_ADMIN:
 * - 모든 Subject에 MANAGE 권한
 * - 제한 없음
 *
 * ADMIN:
 * - 메뉴: 대시보드, 사용자, 일정, 파일, 콘텐츠, 지갑, 설정(Ground정보, UI설정)
 * - CAN_NOT: 역할관리, 권한관리, 테넌트관리
 * - 엔티티: User MANAGE, Reservation MANAGE, Ground READ/UPDATE, Content MANAGE
 * - 기능: 내보내기, 알림발송 가능 / 일괄삭제 불가
 *
 * USER:
 * - 엔티티: 자신의 User READ/UPDATE, 자신의 Reservation CREATE/READ/UPDATE
 * - 엔티티: Ground READ, Content READ
 * - 메뉴/기능 접근 없음 (일반 사용자는 Admin 패널 미접근)
 */
export const permissionSummary = {
	SUPER_ADMIN: {
		description: "시스템 전체 관리자",
		permissions: "모든 Subject에 MANAGE 권한",
	},
	ADMIN: {
		description: "지점 관리자",
		permissions:
			"사용자/일정/파일/콘텐츠/지갑 관리, Ground정보/UI설정 수정, 역할/권한/테넌트관리 접근불가",
	},
	USER: {
		description: "일반 사용자",
		permissions: "자신의 정보/예약만 접근, 시설/콘텐츠 조회",
	},
};
