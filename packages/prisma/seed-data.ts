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
