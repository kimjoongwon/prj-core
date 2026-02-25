"use client";

import { useCallback, useState } from "react";

import type { RequirementGraph } from "../components/requirements/types";
import { queryGraphWithAI } from "../lib/graph-ai";

interface UseGraphAIOptions {
	/** 그래프 데이터 */
	graph: RequirementGraph;
}

/**
 * AI 그래프 질의 훅
 */
export function useGraphAI({ graph }: UseGraphAIOptions) {
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
				const answer = await queryGraphWithAI(question, graph);
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
