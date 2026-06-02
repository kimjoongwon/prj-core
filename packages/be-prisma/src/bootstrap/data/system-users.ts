export interface SystemAdminSeedData {
	email: string;
	legacyEmails?: string[];
	phone: string;
	password: string;
	profile: {
		name: string;
		nickname: string;
	};
}

/**
 * 환경 부팅에 필요한 시스템 관리자 계정입니다.
 *
 * demo 사용자와 달리 새 환경을 바로 운영 가능한 상태로 만들기 위한 기본 계정이므로,
 * bootstrap과 운영 data migration이 같은 정의를 재사용합니다.
 */
export const systemAdminSeedData: SystemAdminSeedData[] = [
	{
		email: "admin@plate.com",
		legacyEmails: ["admin@onora.com"],
		phone: "01073162347",
		password: "rkdmf12!@",
		profile: {
			name: "Super Admin",
			nickname: "오노라",
		},
	},
	{
		email: "wallydevplan@gmail.com",
		phone: "01073162348",
		password: "1qa2ws#ED",
		profile: {
			name: "Wally Devplan",
			nickname: "wallydevplan",
		},
	},
];
