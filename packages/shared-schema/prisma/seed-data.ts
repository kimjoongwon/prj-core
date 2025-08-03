// 시드 데이터를 위한 메타데이터
export interface UserSeedData {
	email: string;
	phone: string;
	password: string;
	profile: {
		name: string;
		nickname: string;
	};
}

export interface GroundSeedData {
	name: string;
	label: string;
	address: string;
	phone: string;
	email: string;
	businessNo: string;
}

// 50명의 일반 유저 데이터
export const userSeedData: UserSeedData[] = Array.from(
	{ length: 50 },
	(_, index) => {
		const userNumber = index + 1;
		// 01011xx 패턴으로 변경하여 Super Admin과 겹치지 않게 함
		return {
			email: `user-${userNumber}@gmail.com`,
			phone: `0101100${String(userNumber).padStart(3, "0")}`,
			password: "user123!@#", // 모든 일반 유저에게 동일한 비밀번호 사용
			profile: {
				name: `일반유저${userNumber}`,
				nickname: `유저${userNumber}`,
			},
		};
	},
);

// 다양한 그라운드 데이터 (50개)
export const groundSeedData: GroundSeedData[] = Array.from(
	{ length: 50 },
	(_, index) => {
		const companyNumber = index + 1;
		return {
			name: `회사-${companyNumber}`,
			label:
				companyNumber <= 10 ? "본점" : companyNumber <= 30 ? "지점" : "분점",
			address: `서울시 ${getRandomDistrict()}`,
			// 02088xx 패턴으로 변경하여 다른 번호들과 겹치지 않게 함
			phone: `0208800${String(companyNumber).padStart(3, "0")}`,
			email: `company-${companyNumber}@gmail.com`,
			businessNo: `${String(companyNumber).padStart(3, "0")}${String(Math.floor(Math.random() * 1000000)).padStart(6, "0")}${String(Math.floor(Math.random() * 100)).padStart(2, "0")}`,
		};
	},
);

// 서울시 구 목록 (랜덤 선택용)
function getRandomDistrict(): string {
	const districts = [
		"강남구",
		"강동구",
		"강북구",
		"강서구",
		"관악구",
		"광진구",
		"구로구",
		"금천구",
		"노원구",
		"도봉구",
		"동대문구",
		"동작구",
		"마포구",
		"서대문구",
		"서초구",
		"성동구",
		"성북구",
		"송파구",
		"양천구",
		"영등포구",
		"용산구",
		"은평구",
		"종로구",
		"중구",
		"중랑구",
	];
	return districts[Math.floor(Math.random() * districts.length)];
}

// 유저와 그라운드 매핑 (각 유저는 1-3개의 그라운드에 소속)
export const userGroundMapping: {
	userIndex: number;
	groundIndices: number[];
}[] = Array.from({ length: 50 }, (_, userIndex) => {
	const numGrounds = Math.floor(Math.random() * 3) + 1; // 1-3개 그라운드
	const groundIndices: number[] = [];

	while (groundIndices.length < numGrounds) {
		const randomGroundIndex = Math.floor(Math.random() * 50);
		if (!groundIndices.includes(randomGroundIndex)) {
			groundIndices.push(randomGroundIndex);
		}
	}

	return {
		userIndex,
		groundIndices,
	};
});
