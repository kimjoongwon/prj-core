import type { StepData } from "./types";

export const backendStep: StepData = {
	id: "backend",
	title: "백엔드 프레임워크",
	description: "서버 측 비즈니스 로직과 API를 처리하는 기술을 선택해주세요.",
	options: [
		{
			id: "spring-boot",
			name: "Spring Boot",
			vendor: "VMware",
			tagline: "Java 기반 엔터프라이즈 표준",
			pros: [
				"대기업·공공기관 표준 — 안정성 검증",
				"어떤 SI 업체든 바로 투입 가능 (유지보수 용이)",
				"대용량 트래픽·배치 처리에 강함",
			],
			cons: [
				"초기 설정 무거움 — 개발 시작 느림",
				"Java 개발자 인건비 상대적으로 높음",
			],
			costRange: "개발 비용 +20~30%",
			bestFor: "안정성 + 이관 예정",
			monthlyCost: 0,
		},
		{
			id: "nestjs",
			name: "NestJS",
			vendor: "오픈소스",
			tagline: "TypeScript 기반 — 프론트와 같은 언어",
			pros: [
				"React(웹)와 같은 언어 — 1명이 프론트+백 모두 가능",
				"개발 속도 빠름 — MVP 출시 최적",
				"타입 정의 공유로 프론트·백 버그 감소",
			],
			cons: [
				"Java 대비 대기업 채용 사례 적음",
				"CPU 집중 작업에 상대적으로 약함",
			],
			costRange: "개발 비용 절감 (풀스택 가능)",
			bestFor: "빠른 MVP + 소규모 팀",
			monthlyCost: 0,
			isRecommended: true,
		},
	],
	comparison: [
		{ label: "언어", values: { "spring-boot": "Java", nestjs: "TypeScript" } },
		{
			label: "개발 속도",
			values: {
				"spring-boot": "느림 (설정·구조화)",
				nestjs: "빠름 (React와 같은 언어)",
			},
		},
		{
			label: "1인 풀스택",
			values: { "spring-boot": "어려움", nestjs: "가능 (같은 언어)" },
		},
		{
			label: "인건비",
			values: {
				"spring-boot": "높음 (Java 시니어)",
				nestjs: "낮음 (풀스택 가능)",
			},
		},
		{
			label: "대기업 납품",
			values: {
				"spring-boot": "표준 (발주처 요구 충족)",
				nestjs: "경우에 따라",
			},
		},
		{
			label: "SI 업체 이관",
			values: {
				"spring-boot": "어떤 업체든 가능",
				nestjs: "TS 경험 확인 필요",
			},
		},
		{
			label: "대용량 트래픽",
			values: {
				"spring-boot": "강함 (멀티스레드)",
				nestjs: "일반 수준 (비동기 I/O)",
			},
		},
		{
			label: "실시간 처리",
			values: { "spring-boot": "보통", nestjs: "강함 (채팅·알림)" },
		},
	],
	recommendations: [
		{
			scenario: "팀 1~3명, 빠른 MVP",
			pick: "nestjs",
			reason: "같은 언어로 1명이 웹+API 다 가능",
		},
		{
			scenario: "React 웹 + 모바일 동시",
			pick: "nestjs",
			reason: "타입·로직 공유 → 비용 절감",
		},
		{
			scenario: "결제·정산 복잡",
			pick: "spring-boot",
			reason: "금융 표준, 트랜잭션 관리 성숙",
		},
		{
			scenario: "공공·대기업 납품",
			pick: "spring-boot",
			reason: "발주처 요구 기술",
		},
		{
			scenario: "나중에 SI 이관",
			pick: "spring-boot",
			reason: "어떤 업체든 투입 가능",
		},
	],
};
