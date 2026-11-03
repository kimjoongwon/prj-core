export interface SelfIntroductionSection {
	title: string;
	paragraphs: readonly string[];
}

export type MobileCareerColumnKey =
	| "period"
	| "companyAndProject"
	| "technologies"
	| "responsibilities";

export interface MobileCareerColumn {
	key: MobileCareerColumnKey;
	label: string;
}

export interface MobileCareerEntry {
	period: string;
	companyAndProject: string;
	technologies: string;
	responsibilities: string;
}

export type MobileCommonCapabilityColumnKey =
	| "area"
	| "projects"
	| "responsibilities";

export interface MobileCommonCapabilityColumn {
	key: MobileCommonCapabilityColumnKey;
	label: string;
}

export interface MobileCommonCapabilityEntry {
	area: string;
	projects: string;
	responsibilities: string;
}

export interface MobileCommonCapabilities {
	title: string;
	columns: readonly MobileCommonCapabilityColumn[];
	entries: readonly MobileCommonCapabilityEntry[];
}

export interface MobileCareer {
	title: string;
	description: string;
	columns: readonly MobileCareerColumn[];
	entries: readonly MobileCareerEntry[];
	commonCapabilities: MobileCommonCapabilities;
}

export interface ProfileLink {
	label: string;
	href: string;
}

export interface SelfIntroduction {
	title: string;
	name: string;
	role: string;
	downloadFileName: string;
	documentVersion: string;
	profileLinks: readonly ProfileLink[];
	sections: readonly SelfIntroductionSection[];
	mobileCareer: MobileCareer;
}

/** 공개 검증을 마친 자기소개서 본문입니다. 화면과 빌드 시 DOCX가 함께 소비합니다. */
export const selfIntroduction: SelfIntroduction = {
	title: "자기소개서",
	name: "김중원",
	role: "웹·모바일 풀스택 개발자",
	downloadFileName: "김중원-자기소개서.docx",
	documentVersion: "20261103-profile-links",
	profileLinks: [
		{ label: "AI 경력 Q&A", href: "https://onjitda.com/dolmen" },
		{ label: "GitHub", href: "https://github.com/kimjoongwon" },
	],
	sections: [
		{
			title: "업무를 이해하고 구조로 정리합니다",
			paragraphs: [
				"저는 React와 React Native를 중심으로 웹·모바일 서비스를 개발하고, 백엔드와 배포·운영까지 함께 다뤄 온 개발자 김중원입니다. 기능을 구현하기 전에 업무의 흐름과 데이터의 관계를 이해하고, 화면과 API가 어떤 책임을 가져야 하는지 정리합니다. 당장의 요구사항을 구현하면서도 다음 변경을 이해하고 이어 갈 수 있는 구조를 만드는 데 집중합니다.",
			],
		},
		{
			title: "웹과 모바일의 연결을 경험했습니다",
			paragraphs: [
				"SK mySUNI와 Connect mySUNI에서는 학습·회원·관리자 웹 서비스를 개발하는 동시에 두 모바일 앱의 iOS·Android 개발과 운영을 전담했습니다. Ionic·Capacitor 기반 앱을 React Native로 전환하고, WebView와 네이티브 사이의 통신 및 앱 생명주기를 설계했습니다. 앱 심사와 스토어·엔터프라이즈 배포, 인증서와 릴리스 관리까지 맡으며 사용자에게 기능이 전달되는 전체 과정을 경험했습니다.",
			],
		},
		{
			title: "대규모 전환에는 기준과 검증을 함께 둡니다",
			paragraphs: [
				"SK가스 프로젝트에서는 프론트엔드 PL로 참여해 FO·BO·MO 서비스의 레거시 화면과 업무 로직을 분석하고, 공통 UI와 컴포넌트 기준을 정리하며 프론트엔드 구조 전환을 수행했습니다. AI를 화면 분석과 반복 작업에 활용하고, Playwright 기반 통합 검증 환경을 구축했습니다. 전환 작업에서는 처리량과 함께 기존 업무 흐름이 유지되는지를 확인할 수 있는 기준을 중요하게 생각합니다.",
			],
		},
		{
			title: "구현 이후의 배포와 운영도 책임져 왔습니다",
			paragraphs: [
				"CRAA에서는 온라인 시험 사이트를 단독으로 구축한 뒤 팀원 두 명의 업무와 일정을 조율했고, WebRTC 기반 실시간 감독 기능을 구현했습니다. 마이허브와 동영상 강의 CMS에서는 프론트엔드·백엔드·데이터 모델·AWS EKS 배포 환경까지 서비스 전반을 개발했습니다. 여러 프로젝트에서 얻은 경험을 바탕으로 기능뿐 아니라 의존성, 환경 설정, 배포와 장애 대응까지 연결해 문제를 살펴봅니다.",
			],
		},
		{
			title: "팀이 이어 갈 수 있는 개발 환경을 만듭니다",
			paragraphs: [
				"Turborepo 기반 모노레포와 공통 패키지, Storybook·MSW·Vitest·Playwright를 활용한 개발·검증 환경을 구성해 왔습니다. AI도 코드 생성에만 한정하지 않고 코드 분석, 설계 검토, 리팩터링과 문서화에 활용합니다. 업무 규칙과 API 계약, 각 구성 요소의 책임을 명확히 남겨 동료와 AI가 같은 기준으로 작업할 수 있도록 하고, 변화가 생겼을 때 이유를 설명할 수 있는 개발자로 일하고자 합니다.",
			],
		},
	],
	mobileCareer: {
		title: "React Native 및 모바일 개발 경력",
		description:
			"React Native 개발부터 iOS·Android 앱 배포와 운영까지 담당한 경력입니다.",
		columns: [
			{ key: "period", label: "기간" },
			{ key: "companyAndProject", label: "회사·프로젝트" },
			{ key: "technologies", label: "기술" },
			{ key: "responsibilities", label: "주요 업무" },
		],
		entries: [
			{
				period: "2019.06–2020.12",
				companyAndProject: "스마트링크커뮤니케이션 · FIRSTEP",
				technologies: "React Native",
				responsibilities:
					"RN 개발 환경 구성, 회원가입·회원탈퇴, 커뮤니티 게시판·게시글 CRUD, 화면 상태 및 데이터 관리 구조 구현.",
			},
			{
				period: "2019.06–2020.12",
				companyAndProject: "스마트링크커뮤니케이션 · 회사가요",
				technologies: "React Native",
				responsibilities:
					"사용자 스케줄 관리 앱 단독 개발, 일·월 단위 일정 관리, 스케줄 API 연동 및 서비스 구조 설계.",
			},
			{
				period: "2021.01–2021.12",
				companyAndProject: "마이허브앤헬스케어 · MyHub",
				technologies: "React Native",
				responsibilities:
					"건강기능식품 성분 관리 모바일 앱 개발, 성분 정보 조회 및 API 연동, 관리자·백엔드와 연결되는 서비스 전반 단독 개발·운영.",
			},
			{
				period: "2022.10–2026.05",
				companyAndProject: "SK mySUNI · mySUNI 및\u00A0Connect\u00A0mySUNI",
				technologies: "React Native",
				responsibilities:
					"대내·대외 앱 2개의 iOS·Android 개발·운영 전담, Ionic·Capacitor 기반 앱의 RN 마이그레이션.",
			},
			{
				period: "2022.10–2026.05",
				companyAndProject: "SK mySUNI · mySUNI 및\u00A0Connect\u00A0mySUNI",
				technologies: "React Native · WebView",
				responsibilities:
					"Web ↔ Native 브리지 및 앱 생명주기 설계·개발, 서비스별 인증·정책을 반영한 앱 전환, 웹·모바일 공통 모듈 개발.",
			},
			{
				period: "2022.10–2026.05",
				companyAndProject: "SK mySUNI · mySUNI 및\u00A0Connect\u00A0mySUNI",
				technologies: "iOS · Android 배포",
				responsibilities:
					"iOS 인증서·Provisioning Profile 및 Android 배포 환경 관리, App Store·Google Play 심사·배포, 엔터프라이즈 배포·운영.",
			},
			{
				period: "2022.10–2026.05",
				companyAndProject: "SK mySUNI · mySUNI 및\u00A0Connect\u00A0mySUNI",
				technologies: "CodePush",
				responsibilities:
					"iOS·Android 양 플랫폼의 CodePush 도입·운영 및 JavaScript 업데이트 배포 체계 구축, 앱 버전·릴리스 관리 및 모바일 장애 대응.",
			},
			{
				period: "2026.05–현재",
				companyAndProject: "SK가스 · WEGO+",
				technologies: "Swift · Kotlin · WebView",
				responsibilities:
					"iOS·Android WebView 앱 개발, 웹·네이티브 브리지, 로그인·세션·자동 로그인, 파일·사진·위치·Tmap 등 단말 기능 연동.",
			},
			{
				period: "2026.05–현재",
				companyAndProject: "SK가스 · WEGO+",
				technologies: "Firebase · FCM",
				responsibilities:
					"FCM 푸시 연동, 등록·갱신 정보의 웹 전달, 알림 권한·수신 동의 처리, 알림 클릭 후 화면 이동 및 백엔드 연동 규격 정리.",
			},
			{
				period: "2026.05–현재",
				companyAndProject: "SK가스 · WEGO+",
				technologies: "빌드·배포·운영",
				responsibilities:
					"iOS 서명·프로비저닝 구성, fastlane 배포 구성, DEV·PROD 환경 분리, Remote Config 기반 업데이트·점검 정책 및 WebView 장애 복구 기능 구현.",
			},
		],
		commonCapabilities: {
			title: "모바일 공통 기능 개발 및 운영",
			columns: [
				{ key: "area", label: "업무 영역" },
				{ key: "projects", label: "프로젝트" },
				{ key: "responsibilities", label: "수행 내용" },
			],
			entries: [
				{
					area: "다국어 지원",
					projects: "Sugar Market",
					responsibilities: "중국어·일본어 다국어 지원 적용.",
				},
				{
					area: "푸시 알림",
					projects:
						"MyHub · ELPG · WEGO · WEGO+ · 두산 밥캣 · mySUNI · Connect mySUNI",
					responsibilities: "Firebase Cloud Messaging(FCM) 설정 및 푸시 연동.",
				},
			],
		},
	},
};
