"use client";

import { useCallback, useState } from "react";

import type { RequirementGraph } from "../components/requirements/types";
import { buildGraphContext, buildSystemPrompt } from "../lib/graph-ai";

interface UseGlobalAIOptions {
	/** 그래프 데이터 (있으면 컨텍스트로 사용) */
	graph?: RequirementGraph;
}

/**
 * 범용 시스템 프롬프트 (graph 없을 때)
 */
function buildGenericSystemPrompt(): string {
	return `당신은 소프트웨어 기획 및 설계 전문가입니다.
사용자의 질문에 친절하고 정확하게 답변해주세요.

## 전문 분야
- 요구사항 분석 및 정의
- 화면 설계 및 UI/UX
- API 설계 및 백엔드 아키텍처
- 데이터베이스 스키마 설계
- 프로젝트 일정 및 마일스톤 관리
- WBS (Work Breakdown Structure) 작성

## 응답 지침
1. 한국어로 답변하세요
2. 실무에서 활용 가능한 구체적인 조언을 제공하세요
3. 필요시 예시나 템플릿을 제공하세요
4. 간결하고 명확하게 답변하세요`;
}

/**
 * AI API 호출
 */
async function queryAI(
	question: string,
	systemPrompt: string,
): Promise<string> {
	const response = await fetch("/api/requirements/ai", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			question,
			systemPrompt,
		}),
	});

	const data = await response.json();

	if (!response.ok) {
		const errorMessage = data.error || response.statusText;
		const details = data.details ? `\n상세: ${data.details}` : "";
		throw new Error(`API 요청 실패: ${errorMessage}${details}`);
	}

	return data.answer;
}

/**
 * 전역 AI 질의 훅
 * - graph가 있으면 그래프 컨텍스트 기반 응답
 * - graph가 없으면 범용 AI 응답
 */
export function useGlobalAI({ graph }: UseGlobalAIOptions = {}) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const [lastResponse, setLastResponse] = useState<string | null>(null);

	/**
	 * AI에게 질문하기
	 */
	const askQuestion = useCallback(
		async (question: string): Promise<string> => {
			setIsLoading(true);
			setError(null);

			try {
				// graph가 있으면 그래프 컨텍스트 사용, 없으면 범용 프롬프트
				const systemPrompt = graph
					? buildSystemPrompt(buildGraphContext(graph))
					: buildGenericSystemPrompt();

				const answer = await queryAI(question, systemPrompt);
				setLastResponse(answer);
				return answer;
			} catch (err) {
				const error = err instanceof Error ? err : new Error("AI 질의 실패");
				setError(error);
				throw error;
			} finally {
				setIsLoading(false);
			}
		},
		[graph],
	);

	/**
	 * 에러 초기화
	 */
	const clearError = useCallback(() => {
		setError(null);
	}, []);

	/**
	 * 마지막 응답 초기화
	 */
	const clearLastResponse = useCallback(() => {
		setLastResponse(null);
	}, []);

	return {
		askQuestion,
		isLoading,
		error,
		lastResponse,
		clearError,
		clearLastResponse,
	};
}
