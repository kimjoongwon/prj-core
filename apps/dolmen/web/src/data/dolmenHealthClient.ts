/** dolmen-api 상태 조회 — 화면 상단 상태 칩과 위키 색인 현황 표시에 쓴다. */

export interface DolmenHealthStatus {
	apiOnline: boolean;
	llmConfigured: boolean;
}

export interface DolmenWikiIndexStatus {
	/** 위키의 색인된 절 개수(source에 "§" 라벨이 붙은 문서) */
	wikiSectionCount: number;
	revision: number;
}

export async function fetchDolmenHealthStatus(): Promise<DolmenHealthStatus> {
	try {
		const response = await fetch("/dolmen/api/health", { cache: "no-store" });
		if (!response.ok) {
			return { apiOnline: false, llmConfigured: false };
		}
		const healthBody = (await response.json()) as { llm_configured?: boolean };
		return {
			apiOnline: true,
			llmConfigured: Boolean(healthBody.llm_configured),
		};
	} catch {
		return { apiOnline: false, llmConfigured: false };
	}
}

export async function fetchDolmenWikiIndexStatus(): Promise<DolmenWikiIndexStatus | null> {
	try {
		const response = await fetch("/dolmen/api/documents", {
			cache: "no-store",
		});
		if (!response.ok) {
			return null;
		}
		const documentsBody = (await response.json()) as {
			revision?: number;
			sources?: string[];
		};
		const wikiSectionSources = (documentsBody.sources ?? []).filter(
			(wikiSource) => wikiSource.includes("§"),
		);
		return {
			wikiSectionCount: wikiSectionSources.length,
			revision: documentsBody.revision ?? 0,
		};
	} catch {
		return null;
	}
}
