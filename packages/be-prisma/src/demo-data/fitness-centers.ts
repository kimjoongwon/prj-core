import { resolveSystemAdminSeedData } from "../bootstrap/data/system-users";

/**
 * dev/stg에서 쓰는 사용자/피트니스센터 데모 데이터입니다.
 *
 * 브랜드·지점명·주소·전화번호·이메일은 전부 실존하지 않는 가상의 데모 값입니다.
 * 이 파일의 핵심 참조 키는 `email`, `fitnessCenter name`입니다. bootstrap 로직은 이 문자열을 기준으로
 * user, fitnessCenter, membership 관계를 이어 붙이므로 값 변경 시 후속 매핑도 함께 봐야 합니다.
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

export interface FitnessCenterSeedData {
	name: string;
	label: string;
	address: string;
	phone: string;
	email: string;
	businessNo: string;
	isSystem?: boolean; // System Space에 연결되는 FitnessCenter
}

// 11명의 다양한 역할 유저 데이터 (PLATFORM_ADMIN 2명, COMPANY_MANAGER 3명, MEMBER 6명)
export const userSeedData: UserSeedData[] = [
	...resolveSystemAdminSeedData().map((user) => ({
		...user,
		role: "PLATFORM_ADMIN",
	})),
	// COMPANY_MANAGER 3명 - 각 지점 관리자
	{
		email: "manager.gwanghwamun@example.com",
		phone: "01000000001",
		password: "Admin123!@#",
		profile: {
			name: "이점장",
			nickname: "광화문점장",
		},
		role: "COMPANY_MANAGER",
	},
	{
		email: "manager.gangnam@example.com",
		phone: "01000000002",
		password: "Admin123!@#",
		profile: {
			name: "박매니저",
			nickname: "강남매니저",
		},
		role: "COMPANY_MANAGER",
	},
	{
		email: "manager.itaewon@example.com",
		phone: "01000000003",
		password: "Admin123!@#",
		profile: {
			name: "최코치",
			nickname: "이태원코치",
		},
		role: "COMPANY_MANAGER",
	},
	// MEMBER 6명 - 실제 회원들
	{
		email: "minsu.kim92@example.com",
		phone: "01000000004",
		password: "User123!@#",
		profile: {
			name: "김민수",
			nickname: "민수",
		},
		role: "MEMBER",
	},
	{
		email: "seoyeon_lee@example.com",
		phone: "01000000005",
		password: "User123!@#",
		profile: {
			name: "이서연",
			nickname: "서연",
		},
		role: "MEMBER",
	},
	{
		email: "yejun.park@example.com",
		phone: "01000000006",
		password: "User123!@#",
		profile: {
			name: "박예준",
			nickname: "예준",
		},
		role: "MEMBER",
	},
	{
		email: "jiwoo0315@example.com",
		phone: "01000000007",
		password: "User123!@#",
		profile: {
			name: "최지우",
			nickname: "지우",
		},
		role: "MEMBER",
	},
	{
		email: "hayoon.jung@example.com",
		phone: "01000000008",
		password: "User123!@#",
		profile: {
			name: "정하윤",
			nickname: "하윤",
		},
		role: "MEMBER",
	},
	{
		email: "doyoon.kang@example.com",
		phone: "01000000009",
		password: "User123!@#",
		profile: {
			name: "강도윤",
			nickname: "도윤",
		},
		role: "MEMBER",
	},
];

// 현실적인 구성의 가상 피트니스 센터 데이터 (11개: System 1 + Branch 10)
export const fitnessCenterSeedData: FitnessCenterSeedData[] = [
	// 플랫폼 운영본부 (System Space FitnessCenter)
	{
		name: "플랫폼 운영본부",
		label: "본사",
		address: "서울시 강남구",
		phone: "02-0000-0000",
		email: resolveSystemAdminSeedData()[0].email,
		businessNo: "000-00-00000",
		isSystem: true,
	},
	// 팀핏 트레이닝 지점들
	{
		name: "팀핏 광화문",
		label: "본점",
		address: "서울시 종로구 샘플로 12 샘플빌딩 B1",
		phone: "02-0000-0001",
		email: "gwanghwamun@example.com",
		businessNo: "101-86-12345",
	},
	{
		name: "팀핏 강남1호",
		label: "지점",
		address: "서울시 강남구 샘플로 21 샘플타워 B2",
		phone: "02-0000-0002",
		email: "gangnam1@example.com",
		businessNo: "102-86-23456",
	},
	{
		name: "팀핏 삼성",
		label: "지점",
		address: "서울시 강남구 샘플로 51 샘플센터 B1",
		phone: "02-0000-0003",
		email: "samsung@example.com",
		businessNo: "103-86-34567",
	},
	{
		name: "팀핏 잠실",
		label: "지점",
		address: "서울시 송파구 샘플로 100 샘플타워 B2",
		phone: "02-0000-0004",
		email: "jamsil@example.com",
		businessNo: "104-86-45678",
	},
	// 리프트하우스 지점들
	{
		name: "리프트하우스 이태원",
		label: "본점",
		address: "서울시 용산구 샘플로 20 샘플빌딩 2층",
		phone: "02-0000-0005",
		email: "itaewon@example.com",
		businessNo: "201-87-56789",
	},
	{
		name: "리프트하우스 마포",
		label: "지점",
		address: "서울시 마포구 샘플로 45 샘플센터 B1",
		phone: "02-0000-0006",
		email: "mapo@example.com",
		businessNo: "202-87-67890",
	},
	// 올데이피트니스
	{
		name: "올데이피트니스 역삼",
		label: "본점",
		address: "서울시 강남구 샘플로 134 샘플빌딩 3층",
		phone: "02-0000-0007",
		email: "yeoksam@example.com",
		businessNo: "301-88-78901",
	},
	{
		name: "올데이피트니스 신논현",
		label: "지점",
		address: "서울시 강남구 샘플로 47 샘플타워 4층",
		phone: "02-0000-0008",
		email: "sinnonhyeon@example.com",
		businessNo: "302-88-89012",
	},
	// 스포라운지
	{
		name: "스포라운지 홍대",
		label: "본점",
		address: "서울시 마포구 샘플로 25 샘플스포츠센터 2층",
		phone: "02-0000-0009",
		email: "hongdae@example.com",
		businessNo: "401-89-90123",
	},
	{
		name: "스포라운지 건대",
		label: "지점",
		address: "서울시 광진구 샘플로 120 샘플빌딩 B1",
		phone: "02-0000-0010",
		email: "kondae@example.com",
		businessNo: "402-89-01234",
	},
];

// userEmail/fitnessCenterNames는 앞선 배열의 business key를 참조하는 연결 정의입니다.
export interface UserFitnessCenterMappingData {
	userEmail: string;
	fitnessCenterNames: string[];
}

// 유저와 피트니스센터 매핑 (정합성 보장 - 역할에 맞는 논리적 연결)
export const userFitnessCenterMapping: UserFitnessCenterMappingData[] = [
	// PLATFORM_ADMIN - 플랫폼 운영본부 (System Space)
	{
		userEmail: resolveSystemAdminSeedData()[0].email,
		fitnessCenterNames: ["플랫폼 운영본부"],
	},
	{
		userEmail: resolveSystemAdminSeedData()[0].email,
		fitnessCenterNames: ["플랫폼 운영본부"],
	},
	// COMPANY_MANAGER - 담당 지점만 (팀핏 계열)
	{
		userEmail: "manager.gwanghwamun@example.com",
		fitnessCenterNames: ["팀핏 광화문"],
	},
	{
		userEmail: "manager.gangnam@example.com",
		fitnessCenterNames: ["팀핏 강남1호", "팀핏 삼성"], // 강남 지역 담당
	},
	// COMPANY_MANAGER - 리프트하우스 담당
	{
		userEmail: "manager.itaewon@example.com",
		fitnessCenterNames: ["리프트하우스 이태원", "리프트하우스 마포"],
	},
	// MEMBER - 가입한 지점 (일반 회원)
	{
		userEmail: "minsu.kim92@example.com",
		fitnessCenterNames: ["팀핏 광화문"], // 광화문 회원
	},
	{
		userEmail: "seoyeon_lee@example.com",
		fitnessCenterNames: ["팀핏 강남1호"], // 강남 회원
	},
	{
		userEmail: "yejun.park@example.com",
		fitnessCenterNames: ["리프트하우스 이태원"], // 리프트하우스 회원
	},
	{
		userEmail: "jiwoo0315@example.com",
		fitnessCenterNames: ["올데이피트니스 역삼", "올데이피트니스 신논현"], // 다중 지점 회원
	},
	{
		userEmail: "hayoon.jung@example.com",
		fitnessCenterNames: ["스포라운지 홍대"], // 스포라운지 회원
	},
	{
		userEmail: "doyoon.kang@example.com",
		fitnessCenterNames: ["팀핏 잠실", "스포라운지 건대"], // 다중 브랜드 회원 (엣지 케이스)
	},
];
