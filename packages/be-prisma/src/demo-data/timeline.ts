/**
 * Timeline / Session / Exercise 데모 정의입니다.
 *
 * timeline id와 exercise code는 seed 재실행 시 같은 데이터를 다시 찾기 위한 안정 키입니다.
 * `seasonTag`는 bootstrap runtime이 최근/중간/과거 데이터를 섞어 날짜를 생성할 때 쓰는 힌트입니다.
 */

export interface TimelineSeedData {
	id: string;
	fitnessCenterName: string;
	createdByEmail: string;
	name: string;
	description: string;
	seasonTag: "recent" | "mid" | "archive";
}

// 타임라인 이름은 사람이 읽는 값이고, 실제 재실행 안정성은 고정 UUID인 `id`가 담당합니다.
export const timelineSeedData: TimelineSeedData[] = [
	{
		id: "6f3d4a4c-b130-43a9-9dd6-3ba76ef7f001",
		fitnessCenterName: "F45 광화문",
		createdByEmail: "manager.gwanghwamun@f45.kr",
		name: "2026 Q1 출근 전 모닝 리커버리",
		description: "06:30-07:20 직장인 대상 저강도-중강도 순환 세션 운영",
		seasonTag: "recent",
	},
	{
		id: "6f3d4a4c-b130-43a9-9dd6-3ba76ef7f002",
		fitnessCenterName: "F45 광화문",
		createdByEmail: "manager.gwanghwamun@f45.kr",
		name: "2025 연말 바디리셋 8주 챌린지",
		description: "체중 감량 집중기 후 회복주를 포함한 연말 타임라인",
		seasonTag: "mid",
	},
	{
		id: "6f3d4a4c-b130-43a9-9dd6-3ba76ef7f003",
		fitnessCenterName: "F45 강남1호",
		createdByEmail: "manager.gangnam@f45.kr",
		name: "2026 상반기 런치 메타콘 블록",
		description: "12시 직장인 수요 대응, 주 3회 메타콘 중심 운영",
		seasonTag: "recent",
	},
	{
		id: "6f3d4a4c-b130-43a9-9dd6-3ba76ef7f004",
		fitnessCenterName: "F45 강남1호",
		createdByEmail: "manager.gangnam@f45.kr",
		name: "2025 Q3 오피스 제휴 애프터워크",
		description: "기업 제휴 회원 대상 18:40 시작 저녁 그룹 클래스 운영",
		seasonTag: "archive",
	},
	{
		id: "6f3d4a4c-b130-43a9-9dd6-3ba76ef7f005",
		fitnessCenterName: "F45 삼성",
		createdByEmail: "manager.gangnam@f45.kr",
		name: "2026 신입 멤버 온보딩 사이클",
		description: "첫 등록 회원의 기초 움직임 적응을 위한 4주 온보딩",
		seasonTag: "recent",
	},
	{
		id: "6f3d4a4c-b130-43a9-9dd6-3ba76ef7f006",
		fitnessCenterName: "F45 삼성",
		createdByEmail: "manager.gangnam@f45.kr",
		name: "2025 하반기 근지구력 베이스 빌드",
		description: "중급 회원 대상 볼륨 증대 후 디로드 1주 포함",
		seasonTag: "mid",
	},
	{
		id: "6f3d4a4c-b130-43a9-9dd6-3ba76ef7f007",
		fitnessCenterName: "F45 잠실",
		createdByEmail: "manager.gwanghwamun@f45.kr",
		name: "2026 주말 패밀리 피트니스 시즌",
		description: "토-일 오전 체험형 클래스, 초급 난이도 비중 확대",
		seasonTag: "recent",
	},
	{
		id: "6f3d4a4c-b130-43a9-9dd6-3ba76ef7f008",
		fitnessCenterName: "F45 잠실",
		createdByEmail: "manager.gwanghwamun@f45.kr",
		name: "2025 여름 시즌 프로그램",
		description: "여름방학 유입 회원 대상 주말 중심 시즌형 운영",
		seasonTag: "archive",
	},
	{
		id: "6f3d4a4c-b130-43a9-9dd6-3ba76ef7f009",
		fitnessCenterName: "크로스핏 이태원",
		createdByEmail: "manager.itaewon@crossfit.kr",
		name: "2026 Open 준비반",
		description: "역도 기술 세션 + 고강도 WOD를 결합한 경쟁 대비 블록",
		seasonTag: "recent",
	},
	{
		id: "6f3d4a4c-b130-43a9-9dd6-3ba76ef7f010",
		fitnessCenterName: "크로스핏 이태원",
		createdByEmail: "manager.itaewon@crossfit.kr",
		name: "2025 기초 역도 적응반",
		description: "초급 회원의 스내치/클린 기초 패턴 학습 과정",
		seasonTag: "mid",
	},
	{
		id: "6f3d4a4c-b130-43a9-9dd6-3ba76ef7f011",
		fitnessCenterName: "크로스핏 마포",
		createdByEmail: "manager.itaewon@crossfit.kr",
		name: "2026 커뮤니티 팀 WOD 시즌",
		description: "주말 팀 기반 세션 중심, 중급 회원 리텐션 강화",
		seasonTag: "recent",
	},
	{
		id: "6f3d4a4c-b130-43a9-9dd6-3ba76ef7f012",
		fitnessCenterName: "크로스핏 마포",
		createdByEmail: "manager.itaewon@crossfit.kr",
		name: "2025 입문자 스케일드 트랙",
		description: "버피/로잉 중심 기초 메타콘 적응 트랙",
		seasonTag: "archive",
	},
	{
		id: "6f3d4a4c-b130-43a9-9dd6-3ba76ef7f013",
		fitnessCenterName: "애니타임피트니스 역삼",
		createdByEmail: "manager.gangnam@f45.kr",
		name: "2026 체지방 감량 부트캠프",
		description: "근력과 인터벌 유산소를 병행하는 6주 감량 프로그램",
		seasonTag: "recent",
	},
	{
		id: "6f3d4a4c-b130-43a9-9dd6-3ba76ef7f014",
		fitnessCenterName: "애니타임피트니스 신논현",
		createdByEmail: "manager.gangnam@f45.kr",
		name: "2025 하반기 근지구력 강화",
		description: "근지구력 볼륨 증가 후 회복 세션 비율을 높인 블록",
		seasonTag: "mid",
	},
	{
		id: "6f3d4a4c-b130-43a9-9dd6-3ba76ef7f015",
		fitnessCenterName: "스포애니 홍대",
		createdByEmail: "manager.itaewon@crossfit.kr",
		name: "2026 새벽 클래스 파일럿",
		description: "06시대 40분 클래스 A/B 테스트 및 출석률 검증",
		seasonTag: "recent",
	},
	{
		id: "6f3d4a4c-b130-43a9-9dd6-3ba76ef7f016",
		fitnessCenterName: "스포애니 건대",
		createdByEmail: "manager.itaewon@crossfit.kr",
		name: "2025 야간 직장인 스트렝스 라인",
		description: "20시 이후 직장인 대상 중강도 스트렝스 루틴 운영",
		seasonTag: "mid",
	},
];

export interface ExerciseCatalogSeedData {
	code: string;
	name: string;
	category: "strength" | "cardio" | "core" | "mobility";
	difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
	typicalDurationSec: number;
	typicalCount: number;
	caloriesPerMinute: number;
	description: string;
}

export const exerciseCatalogSeedData: ExerciseCatalogSeedData[] = [
	{
		code: "AIR_SQUAT",
		name: "에어 스쿼트",
		category: "strength",
		difficulty: "BEGINNER",
		typicalDurationSec: 50,
		typicalCount: 20,
		caloriesPerMinute: 8,
		description: "체중 부하로 하체 패턴을 익히는 기본 스쿼트",
	},
	{
		code: "GOBLET_SQUAT",
		name: "고블릿 스쿼트",
		category: "strength",
		difficulty: "INTERMEDIATE",
		typicalDurationSec: 60,
		typicalCount: 14,
		caloriesPerMinute: 9,
		description: "덤벨/케틀벨 전면 하중으로 하체 안정성 강화",
	},
	{
		code: "DEADLIFT",
		name: "데드리프트",
		category: "strength",
		difficulty: "INTERMEDIATE",
		typicalDurationSec: 70,
		typicalCount: 10,
		caloriesPerMinute: 10,
		description: "둔근과 햄스트링 중심의 전신 후면 사슬 강화",
	},
	{
		code: "BENCH_PRESS",
		name: "벤치프레스",
		category: "strength",
		difficulty: "INTERMEDIATE",
		typicalDurationSec: 65,
		typicalCount: 10,
		caloriesPerMinute: 8,
		description: "가슴/삼두 중심 상체 프레스 기본 동작",
	},
	{
		code: "PUSH_UP",
		name: "푸시업",
		category: "strength",
		difficulty: "BEGINNER",
		typicalDurationSec: 45,
		typicalCount: 15,
		caloriesPerMinute: 8,
		description: "장비 없이 상체 근지구력을 향상하는 대표 동작",
	},
	{
		code: "PULL_UP",
		name: "풀업",
		category: "strength",
		difficulty: "ADVANCED",
		typicalDurationSec: 40,
		typicalCount: 8,
		caloriesPerMinute: 9,
		description: "광배/상완 이두를 중심으로 등 근력 강화",
	},
	{
		code: "ROWING_500M",
		name: "로잉 500m",
		category: "cardio",
		difficulty: "INTERMEDIATE",
		typicalDurationSec: 130,
		typicalCount: 1,
		caloriesPerMinute: 12,
		description: "단시간 고강도 유산소 + 전신 협응 훈련",
	},
	{
		code: "RUN_800M",
		name: "러닝 800m",
		category: "cardio",
		difficulty: "INTERMEDIATE",
		typicalDurationSec: 260,
		typicalCount: 1,
		caloriesPerMinute: 13,
		description: "중거리 인터벌 구간에서 심폐지구력 향상",
	},
	{
		code: "JUMP_ROPE",
		name: "줄넘기",
		category: "cardio",
		difficulty: "BEGINNER",
		typicalDurationSec: 120,
		typicalCount: 80,
		caloriesPerMinute: 11,
		description: "짧은 시간에 심박수를 높이는 기초 유산소",
	},
	{
		code: "BIKE_SPRINT",
		name: "에어바이크 스프린트",
		category: "cardio",
		difficulty: "ADVANCED",
		typicalDurationSec: 45,
		typicalCount: 1,
		caloriesPerMinute: 15,
		description: "20-45초 최대 출력 인터벌",
	},
	{
		code: "BURPEE",
		name: "버피",
		category: "cardio",
		difficulty: "INTERMEDIATE",
		typicalDurationSec: 55,
		typicalCount: 15,
		caloriesPerMinute: 14,
		description: "전신 지구력/심폐능력을 동시에 자극",
	},
	{
		code: "MOUNTAIN_CLIMBER",
		name: "마운틴 클라이머",
		category: "core",
		difficulty: "BEGINNER",
		typicalDurationSec: 45,
		typicalCount: 30,
		caloriesPerMinute: 11,
		description: "코어 안정성과 유산소 자극을 동시에 수행",
	},
	{
		code: "PLANK",
		name: "플랭크",
		category: "core",
		difficulty: "BEGINNER",
		typicalDurationSec: 60,
		typicalCount: 1,
		caloriesPerMinute: 6,
		description: "복부/척추 안정성 기본 유지 동작",
	},
	{
		code: "SIDE_PLANK",
		name: "사이드 플랭크",
		category: "core",
		difficulty: "INTERMEDIATE",
		typicalDurationSec: 45,
		typicalCount: 1,
		caloriesPerMinute: 6,
		description: "측면 코어와 둔중근 안정화",
	},
	{
		code: "RUSSIAN_TWIST",
		name: "러시안 트위스트",
		category: "core",
		difficulty: "INTERMEDIATE",
		typicalDurationSec: 50,
		typicalCount: 24,
		caloriesPerMinute: 8,
		description: "회전 코어 자극 및 복사근 강화",
	},
	{
		code: "HIP_BRIDGE",
		name: "힙 브리지",
		category: "mobility",
		difficulty: "BEGINNER",
		typicalDurationSec: 45,
		typicalCount: 20,
		caloriesPerMinute: 6,
		description: "둔근 활성화와 허리 부담 완화",
	},
	{
		code: "WORLD_GREATEST_STRETCH",
		name: "월드 그레이티스트 스트레치",
		category: "mobility",
		difficulty: "BEGINNER",
		typicalDurationSec: 75,
		typicalCount: 8,
		caloriesPerMinute: 5,
		description: "고관절/흉추 가동성을 동시에 여는 준비 동작",
	},
	{
		code: "THRUSTER",
		name: "쓰러스터",
		category: "strength",
		difficulty: "ADVANCED",
		typicalDurationSec: 65,
		typicalCount: 12,
		caloriesPerMinute: 12,
		description: "스쿼트와 오버헤드 프레스를 결합한 복합 전신 운동",
	},
	{
		code: "KETTLEBELL_SWING",
		name: "케틀벨 스윙",
		category: "strength",
		difficulty: "INTERMEDIATE",
		typicalDurationSec: 50,
		typicalCount: 18,
		caloriesPerMinute: 12,
		description: "힙힌지 기반 폭발력과 심폐를 동시에 자극",
	},
	{
		code: "DUMBBELL_SNATCH",
		name: "덤벨 스내치",
		category: "strength",
		difficulty: "INTERMEDIATE",
		typicalDurationSec: 55,
		typicalCount: 12,
		caloriesPerMinute: 11,
		description: "편측 폭발력과 코어 안정성을 함께 강화",
	},
	{
		code: "BOX_JUMP",
		name: "박스 점프",
		category: "cardio",
		difficulty: "INTERMEDIATE",
		typicalDurationSec: 45,
		typicalCount: 14,
		caloriesPerMinute: 13,
		description: "하체 탄성과 심박 상승을 동시에 노리는 플라이오메트릭",
	},
	{
		code: "ASSAULT_BIKE_12CAL",
		name: "에어바이크 12칼로리",
		category: "cardio",
		difficulty: "ADVANCED",
		typicalDurationSec: 35,
		typicalCount: 1,
		caloriesPerMinute: 15,
		description: "짧고 강한 인터벌에 적합한 무산소 파워 세트",
	},
	{
		code: "HOLLOW_HOLD",
		name: "할로우 홀드",
		category: "core",
		difficulty: "INTERMEDIATE",
		typicalDurationSec: 40,
		typicalCount: 1,
		caloriesPerMinute: 6,
		description: "체간 긴장 유지 능력을 높이는 체조 기반 코어 동작",
	},
	{
		code: "DEAD_BUG",
		name: "데드 버그",
		category: "core",
		difficulty: "BEGINNER",
		typicalDurationSec: 50,
		typicalCount: 16,
		caloriesPerMinute: 5,
		description: "요추 중립을 유지하며 복부 안정성을 만드는 입문 코어",
	},
	{
		code: "SHOULDER_MOBILITY_FLOW",
		name: "숄더 모빌리티 플로우",
		category: "mobility",
		difficulty: "BEGINNER",
		typicalDurationSec: 90,
		typicalCount: 6,
		caloriesPerMinute: 4,
		description: "견갑 움직임 회복과 오버헤드 동작 준비를 위한 가동성 루틴",
	},
	{
		code: "COSSACK_SQUAT",
		name: "코사크 스쿼트",
		category: "mobility",
		difficulty: "INTERMEDIATE",
		typicalDurationSec: 60,
		typicalCount: 12,
		caloriesPerMinute: 6,
		description: "고관절 가동성과 내전근 유연성을 동시에 확보",
	},
];

export interface SessionTemplateSeedData {
	code: string;
	name: string;
	phaseWeek: string;
	durationMin: number;
	level: "초급" | "중급" | "고급";
	focus: "strength" | "metcon" | "recovery";
	targetRpe: number;
	recommendedRestSec: number;
	workRestScheme: string;
	coachNote: string;
}

export const sessionTemplateSeedData: SessionTemplateSeedData[] = [
	{
		code: "MORNING_ENGINE",
		name: "모닝 엔진",
		phaseWeek: "1-2주차",
		durationMin: 45,
		level: "중급",
		focus: "metcon",
		targetRpe: 7,
		recommendedRestSec: 40,
		workRestScheme:
			"10분 워밍업 + 30분 인터벌(40초 운동/20초 전환) + 5분 쿨다운",
		coachNote:
			"아침 클래스 특성상 첫 2라운드는 RPE 6으로 시작해 심박을 점진적으로 올린다.",
	},
	{
		code: "LUNCH_METCON",
		name: "런치 메타콘",
		phaseWeek: "3-4주차",
		durationMin: 50,
		level: "중급",
		focus: "metcon",
		targetRpe: 8,
		recommendedRestSec: 35,
		workRestScheme: "12분 스킬 드릴 + 24분 EMOM + 14분 코어/정리",
		coachNote: "점심시간 수업으로 종료 10분 전부터 호흡 회복 구간을 포함한다.",
	},
	{
		code: "AFTERWORK_STRENGTH",
		name: "애프터워크 스트렝스",
		phaseWeek: "5-6주차",
		durationMin: 55,
		level: "중급",
		focus: "strength",
		targetRpe: 7,
		recommendedRestSec: 75,
		workRestScheme: "15분 준비운동 + 30분 메인 리프트(5x5) + 10분 보조운동",
		coachNote:
			"퇴근 후 피로 누적을 고려해 3세트 이후 바벨 중량 증가는 2.5kg 이내로 제한한다.",
	},
	{
		code: "FOUNDATION_101",
		name: "파운데이션 101",
		phaseWeek: "입문 적응 주간",
		durationMin: 40,
		level: "초급",
		focus: "recovery",
		targetRpe: 5,
		recommendedRestSec: 90,
		workRestScheme: "10분 관절 가동성 + 20분 기본 패턴 학습 + 10분 스트레칭",
		coachNote:
			"초보 회원의 동작 품질 확보를 위해 속도보다 가동 범위와 자세 큐를 우선한다.",
	},
	{
		code: "OPEN_PREP",
		name: "오픈 프렙",
		phaseWeek: "대회 2주 전 피크",
		durationMin: 60,
		level: "고급",
		focus: "strength",
		targetRpe: 9,
		recommendedRestSec: 120,
		workRestScheme: "20분 역도 테크닉 + 25분 AMRAP + 15분 리커버리",
		coachNote: "기록 측정 세션으로 마지막 블록에서만 RPE 9까지 허용한다.",
	},
	{
		code: "SATURDAY_TEAM_WOD",
		name: "토요 팀 WOD",
		phaseWeek: "주말 팀 챌린지",
		durationMin: 70,
		level: "중급",
		focus: "metcon",
		targetRpe: 8,
		recommendedRestSec: 50,
		workRestScheme: "15분 팀 전략 브리핑 + 40분 파트너 WOD + 15분 단체 쿨다운",
		coachNote: "2인 1조 구성 시 체력 편차를 고려해 역할을 분리 배정한다.",
	},
	{
		code: "MOBILITY_RESET",
		name: "모빌리티 리셋",
		phaseWeek: "디로드 주간",
		durationMin: 35,
		level: "초급",
		focus: "recovery",
		targetRpe: 4,
		recommendedRestSec: 100,
		workRestScheme:
			"8분 호흡 정렬 + 18분 가동성 플로우 + 9분 저강도 코어 활성화",
		coachNote:
			"근육통이 높은 회원은 가동 범위를 줄이고 호흡 템포를 일정하게 유지한다.",
	},
	{
		code: "POWER_LIFTING_HOUR",
		name: "파워 리프팅 아워",
		phaseWeek: "고강도 빌드업",
		durationMin: 65,
		level: "고급",
		focus: "strength",
		targetRpe: 8,
		recommendedRestSec: 130,
		workRestScheme: "15분 워밍업 + 35분 메인 리프트(중량 피라미드) + 15분 보조",
		coachNote:
			"세트 간 휴식은 최소 2분 유지하고 실패 반복이 나오면 즉시 중량을 5% 낮춘다.",
	},
	{
		code: "CARDIO_INTERVAL_45",
		name: "카디오 인터벌 45",
		phaseWeek: "심폐 적응 주간",
		durationMin: 45,
		level: "중급",
		focus: "metcon",
		targetRpe: 7,
		recommendedRestSec: 30,
		workRestScheme:
			"10분 워밍업 + 24분 인터벌(30초 고강도/30초 회복) + 11분 정리운동",
		coachNote:
			"최대 심박 구간은 3-4세트에 집중 배치하고 후반은 회복 페이스로 마무리한다.",
	},
];

export interface SessionLoadProfileSeedData {
	userEmail: string;
	tier: "HEAVY" | "MEDIUM" | "LIGHT";
	preferredFitnessCenterNames: string[];
}

export const sessionLoadProfileSeedData: SessionLoadProfileSeedData[] = [
	{
		userEmail: "manager.gangnam@f45.kr",
		tier: "HEAVY",
		preferredFitnessCenterNames: [
			"F45 강남1호",
			"F45 삼성",
			"애니타임피트니스 역삼",
			"애니타임피트니스 신논현",
		],
	},
	{
		userEmail: "manager.gwanghwamun@f45.kr",
		tier: "MEDIUM",
		preferredFitnessCenterNames: ["F45 광화문", "F45 잠실", "F45 강남1호"],
	},
	{
		userEmail: "manager.itaewon@crossfit.kr",
		tier: "HEAVY",
		preferredFitnessCenterNames: [
			"크로스핏 이태원",
			"크로스핏 마포",
			"스포애니 홍대",
			"스포애니 건대",
		],
	},
	{
		userEmail: "minsu.kim92@gmail.com",
		tier: "MEDIUM",
		preferredFitnessCenterNames: ["F45 광화문"],
	},
	{
		userEmail: "seoyeon_lee@naver.com",
		tier: "LIGHT",
		preferredFitnessCenterNames: ["F45 강남1호"],
	},
	{
		userEmail: "yejun.park@kakao.com",
		tier: "HEAVY",
		preferredFitnessCenterNames: ["크로스핏 이태원"],
	},
	{
		userEmail: "jiwoo0315@gmail.com",
		tier: "MEDIUM",
		preferredFitnessCenterNames: [
			"애니타임피트니스 역삼",
			"애니타임피트니스 신논현",
		],
	},
	{
		userEmail: "hayoon.jung@naver.com",
		tier: "LIGHT",
		preferredFitnessCenterNames: ["스포애니 홍대"],
	},
	{
		userEmail: "doyoon.kang@gmail.com",
		tier: "LIGHT",
		preferredFitnessCenterNames: ["F45 잠실", "스포애니 건대"],
	},
];
