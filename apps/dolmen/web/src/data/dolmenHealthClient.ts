/** dolmen-api와 등록 이력서의 상태를 조회한다. */

export interface DolmenHealthStatus {
	apiOnline: boolean;
	llmConfigured: boolean;
}

export type DolmenResumeStatus =
	| {
			state: "ready";
			sectionCount: number;
			revision: number;
			sources: string[];
			candidateName: string;
			resumeUpdatedAt: string;
	  }
	| { state: "unregistered" | "not-ready" | "unavailable" };

interface DolmenResumeStatusBody {
	revision?: unknown;
	sources?: unknown;
	resume_configured?: unknown;
	resume_ready?: unknown;
	section_count?: unknown;
	candidate_name?: unknown;
	resume_updated_at?: unknown;
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

export async function fetchDolmenResumeStatus(): Promise<DolmenResumeStatus> {
	try {
		const response = await fetch("/dolmen/api/documents", {
			cache: "no-store",
		});
		if (!response.ok) {
			const errorBody = (await response.json()) as {
				detail?: { code?: string };
			};
			if (errorBody.detail?.code === "resume_not_configured") {
				return { state: "unregistered" };
			}
			if (errorBody.detail?.code === "resume_not_ready") {
				return { state: "not-ready" };
			}
			return { state: "unavailable" };
		}
		const resumeBody = (await response.json()) as DolmenResumeStatusBody;
		if (resumeBody.resume_configured === false) {
			return { state: "unregistered" };
		}
		if (
			resumeBody.resume_configured !== true ||
			typeof resumeBody.resume_ready !== "boolean" ||
			typeof resumeBody.section_count !== "number" ||
			!Number.isInteger(resumeBody.section_count) ||
			typeof resumeBody.revision !== "number" ||
			!Number.isInteger(resumeBody.revision) ||
			resumeBody.revision < 0 ||
			!Array.isArray(resumeBody.sources) ||
			!resumeBody.sources.every(
				(source): source is string => typeof source === "string",
			) ||
			typeof resumeBody.candidate_name !== "string" ||
			typeof resumeBody.resume_updated_at !== "string"
		) {
			return { state: "unavailable" };
		}
		if (
			!resumeBody.resume_ready ||
			resumeBody.section_count <= 0 ||
			resumeBody.sources.length === 0
		) {
			return { state: "not-ready" };
		}
		return {
			state: "ready",
			sectionCount: resumeBody.section_count,
			revision: resumeBody.revision,
			sources: resumeBody.sources,
			candidateName: resumeBody.candidate_name.trim(),
			resumeUpdatedAt: resumeBody.resume_updated_at,
		};
	} catch {
		return { state: "unavailable" };
	}
}
