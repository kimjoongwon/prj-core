import type { TechOption } from "./types";

export interface AIStack {
	needed: boolean;
	options: TechOption[];
}

export const aiServiceStep = {
	id: "ai-service",
	title: "AI 서비스",
	description: "AI 기능이 필요한지 선택해주세요.",
};

export const aiStack: TechOption[] = [
	{
		id: "fastapi",
		name: "FastAPI (Python)",
		vendor: "오픈소스",
		tagline: "Python 기반 고성능 API 서버",
		pros: [
			"AI/ML 라이브러리 생태계 (PyTorch, LangChain)",
			"타입 힌트 기반 자동 API 문서 생성",
			"비동기 처리 우수",
		],
		cons: ["백엔드와 별도 서버로 운영 필요"],
		costRange: "서버 비용 추가 (월 ~3만원)",
		bestFor: "AI 챗봇·추천·분석",
		monthlyCost: 30000,
	},
	{
		id: "langchain",
		name: "LangChain",
		vendor: "오픈소스",
		tagline: "LLM 애플리케이션 프레임워크",
		pros: [
			"OpenAI·Anthropic·자체모델 통합",
			"RAG (검색 증강 생성) 지원",
			"체인·에이전트 패턴",
		],
		cons: ["빠르게 변화하는 API — 버전 관리 필요"],
		costRange: "라이선스 무료",
		bestFor: "챗봇·문서 검색·워크플로우",
		monthlyCost: 0,
	},
	{
		id: "vector-db",
		name: "Vector DB (pgvector)",
		vendor: "PostgreSQL 확장",
		tagline: "PostgreSQL에 벡터 검색 추가",
		pros: ["별도 DB 불필요 — 기존 PostgreSQL 활용", "유사도 검색으로 RAG 구현"],
		cons: ["대규모 임베딩 시 전용 DB 검토"],
		costRange: "무료 (PostgreSQL 확장)",
		bestFor: "문서 검색·추천",
		monthlyCost: 0,
	},
];
