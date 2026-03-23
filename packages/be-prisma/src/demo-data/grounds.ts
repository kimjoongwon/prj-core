import { systemAdminSeedData } from "../bootstrap/data/system-users";

/**
 * dev/stg에서 쓰는 사용자/지점 데모 데이터입니다.
 *
 * 이 파일의 핵심 참조 키는 `email`, `ground name`입니다. bootstrap 로직은 이 문자열을 기준으로
 * user, ground, membership 관계를 이어 붙이므로 값 변경 시 후속 매핑도 함께 봐야 합니다.
 */

// 시드 데이터를 위한 메타데이터
export interface UserSeedData {
	email: string;
	phone: string;
	password: string;
	profile: {
		name: string;
		nickname: string;
	};
	role?: string;
}

export interface GroundSeedData {
	name: string;
	label: string;
	address: string;
	phone: string;
	email: string;
	businessNo: string;
	isSystem?: boolean; // System Space에 연결되는 Ground
}

// 11명의 다양한 역할 유저 데이터 (FULL_ACCESS 2명, MANAGE 3명, VIEW 6명)
export const userSeedData: UserSeedData[] = [
	...systemAdminSeedData.map((user) => ({
		...user,
		role: "FULL_ACCESS",
	})),
	// MANAGE 3명 - 각 지점 관리자
	{
		email: "manager.gwanghwamun@f45.kr",
		phone: "01023456789",
		password: "Admin123!@#",
		profile: {
			name: "이점장",
			nickname: "광화문점장",
		},
		role: "MANAGE",
	},
	{
		email: "manager.gangnam@f45.kr",
		phone: "01034567890",
		password: "Admin123!@#",
		profile: {
			name: "박매니저",
			nickname: "강남매니저",
		},
		role: "MANAGE",
	},
	{
		email: "manager.itaewon@crossfit.kr",
		phone: "01045678901",
		password: "Admin123!@#",
		profile: {
			name: "최코치",
			nickname: "이태원코치",
		},
		role: "MANAGE",
	},
	// VIEW 6명 - 실제 회원들
	{
		email: "minsu.kim92@gmail.com",
		phone: "01056789012",
		password: "User123!@#",
		profile: {
			name: "김민수",
			nickname: "민수",
		},
		role: "VIEW",
	},
	{
		email: "seoyeon_lee@naver.com",
		phone: "01067890123",
		password: "User123!@#",
		profile: {
			name: "이서연",
			nickname: "서연",
		},
		role: "VIEW",
	},
	{
		email: "yejun.park@kakao.com",
		phone: "01078901234",
		password: "User123!@#",
		profile: {
			name: "박예준",
			nickname: "예준",
		},
		role: "VIEW",
	},
	{
		email: "jiwoo0315@gmail.com",
		phone: "01089012345",
		password: "User123!@#",
		profile: {
			name: "최지우",
			nickname: "지우",
		},
		role: "VIEW",
	},
	{
		email: "hayoon.jung@naver.com",
		phone: "01090123456",
		password: "User123!@#",
		profile: {
			name: "정하윤",
			nickname: "하윤",
		},
		role: "VIEW",
	},
	{
		email: "doyoon.kang@gmail.com",
		phone: "01001234567",
		password: "User123!@#",
		profile: {
			name: "강도윤",
			nickname: "도윤",
		},
		role: "VIEW",
	},
];

// 현실적인 피트니스 센터 그라운드 데이터 (11개: System 1 + Branch 10)
export const groundSeedData: GroundSeedData[] = [
	// 플랫폼 운영본부 (System Space Ground)
	{
		name: "플랫폼 운영본부",
		label: "본사",
		address: "서울시 강남구",
		phone: "02-0000-0000",
		email: "admin@plate.com",
		businessNo: "000-00-00000",
		isSystem: true,
	},
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

// userEmail/groundNames는 앞선 배열의 business key를 참조하는 연결 정의입니다.
export interface UserGroundMappingData {
	userEmail: string;
	groundNames: string[];
}

// 유저와 그라운드 매핑 (정합성 보장 - 역할에 맞는 논리적 연결)
export const userGroundMapping: UserGroundMappingData[] = [
	// FULL_ACCESS - 플랫폼 운영본부 (System Space)
	{
		userEmail: "admin@plate.com",
		groundNames: ["플랫폼 운영본부"],
	},
	{
		userEmail: "wallydevplan@gmail.com",
		groundNames: ["플랫폼 운영본부"],
	},
	// MANAGE - 담당 지점만 (F45 계열)
	{
		userEmail: "manager.gwanghwamun@f45.kr",
		groundNames: ["F45 광화문"],
	},
	{
		userEmail: "manager.gangnam@f45.kr",
		groundNames: ["F45 강남1호", "F45 삼성"], // 강남 지역 담당
	},
	// MANAGE - 크로스핏 담당
	{
		userEmail: "manager.itaewon@crossfit.kr",
		groundNames: ["크로스핏 이태원", "크로스핏 마포"],
	},
	// VIEW - 가입한 지점 (일반 회원)
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
