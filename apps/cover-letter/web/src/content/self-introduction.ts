export interface SelfIntroductionSection {
	title: string;
	paragraphs: readonly string[];
}

export interface SelfIntroduction {
	title: string;
	name: string;
	role: string;
	downloadFileName: string;
	sections: readonly SelfIntroductionSection[];
}

/** 공개 검증을 마친 자기소개서 본문입니다. 화면과 빌드 시 DOCX가 함께 소비합니다. */
export const selfIntroduction: SelfIntroduction = {
	title: "자기소개서",
	name: "김중원",
	role: "웹·모바일 풀스택 개발자",
	downloadFileName: "김중원-자기소개서.docx",
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
};
