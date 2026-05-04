/**
 * bootstrap 단계에서 사용하는 약관/동의 정의입니다.
 *
 * reference-data처럼 전역 기준값을 버전드 migration으로 강제 반영하는 성격보다는,
 * 초기 환경을 세울 때 기본 약관 묶음을 넣는 목적에 가깝습니다.
 */

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

// `type + version`이 약관 문서의 의미상 식별자 역할을 합니다.
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

// userEmail은 bootstrap에서 만든 계정과 연결하는 참조 키입니다.
export interface UserAgreementMappingData {
	userEmail: string;
	agreements: AgreementType[];
}

// FULL_ACCESS(admin@onora.com)은 시스템 관리자이므로 일반 회원 약관 흐름에서 제외합니다.
export const userAgreementMapping: UserAgreementMappingData[] = [
	// MANAGE들 - 필수 + 마케팅 동의
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
	// VIEW들 - 다양한 동의 패턴 (테스트 시나리오)
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
