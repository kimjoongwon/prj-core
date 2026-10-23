// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchDolmenResumeStatus } from "./dolmenHealthClient";

function createResumeStatusBody() {
	return {
		revision: 1,
		sources: ["등록 이력서 · 1쪽"],
		resume_configured: true,
		resume_ready: true,
		section_count: 1,
		candidate_name: "테스트 지원자",
		resume_updated_at: "테스트 기준일",
	};
}

function mockResumeResponse(body: unknown, status = 200) {
	const fetchResumeStatus = vi
		.fn()
		.mockResolvedValue(Response.json(body, { status }));
	vi.stubGlobal("fetch", fetchResumeStatus);
	return fetchResumeStatus;
}

afterEach(() => vi.unstubAllGlobals());

describe("fetchDolmenResumeStatus", () => {
	it("새 이력서 상태와 쪽 출처를 화면 계약으로 변환한다", async () => {
		const fetchResumeStatus = mockResumeResponse(createResumeStatusBody());
		await expect(fetchDolmenResumeStatus()).resolves.toEqual({
			state: "ready",
			sectionCount: 1,
			revision: 1,
			sources: ["등록 이력서 · 1쪽"],
			candidateName: "테스트 지원자",
			resumeUpdatedAt: "테스트 기준일",
		});
		expect(fetchResumeStatus).toHaveBeenCalledWith("/dolmen/api/documents", {
			cache: "no-store",
		});
	});

	it.each([
		["resume_not_configured", "unregistered"],
		["resume_not_ready", "not-ready"],
		["unknown", "unavailable"],
	])("HTTP503 %s를 %s로 구분한다", async (code, state) => {
		mockResumeResponse(
			{ detail: { code, message: "이력서를 준비할 수 없습니다." } },
			503,
		);
		await expect(fetchDolmenResumeStatus()).resolves.toEqual({ state });
	});

	it.each([
		[{ ...createResumeStatusBody(), resume_configured: false }, "unregistered"],
		[{ ...createResumeStatusBody(), resume_ready: false }, "not-ready"],
		[
			{ ...createResumeStatusBody(), section_count: 0, sources: [] },
			"not-ready",
		],
		[{ revision: 1, sources: ["이전 문서"] }, "unavailable"],
	])("미등록·미준비·이전 응답을 준비됨으로 표시하지 않는다 %#", async (body, state) => {
		mockResumeResponse(body);
		await expect(fetchDolmenResumeStatus()).resolves.toEqual({ state });
	});

	it("통신 실패와 JSON 실패를 준비 실패 상태로 반환한다", async () => {
		vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("network")));
		await expect(fetchDolmenResumeStatus()).resolves.toEqual({
			state: "unavailable",
		});
		vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("invalid")));
		await expect(fetchDolmenResumeStatus()).resolves.toEqual({
			state: "unavailable",
		});
	});
	it("선택적 개발 메타데이터와 등록 절 전체를 변환하고 알 수 없는 필드는 보관하지 않는다", async () => {
		mockResumeResponse({
			...createResumeStatusBody(),
			debug: {
				page_count: 5,
				sanitized_character_count: 2000,
				embedding_model: "test-embedding",
				retrieval_limit: 5,
				context_policy: "full_sanitized_resume",
				privacy_filter_version: "test-filter",
				index_version: "test-index",
				model_id: "",
				history_turn_limit: 2,
				session_limit: 50,
				secret: "비공개",
				sections: Array.from({ length: 5 }, (_, index) => ({
					document_id: `test-${index}`,
					source: `등록 이력서 · ${index + 1}쪽`,
					version: "test",
					character_count: 100,
					snippet: "정제된 테스트 발췌문",
				})),
			},
		});
		const resume = await fetchDolmenResumeStatus();
		expect(resume.state).toBe("ready");
		if (resume.state !== "ready") throw new Error("ready expected");
		expect(resume.debug).toMatchObject({
			pageCount: 5,
			sanitizedCharacterCount: 2000,
			embeddingModel: "test-embedding",
			retrievalLimit: 5,
			contextPolicy: "full_sanitized_resume",
			privacyFilterVersion: "test-filter",
			indexVersion: "test-index",
			modelId: "",
			historyTurnLimit: 2,
			sessionLimit: 50,
		});
		expect(resume.debug?.sections).toHaveLength(5);
		expect(resume.debug?.sections?.[4]).toMatchObject({
			documentId: "test-4",
			source: "등록 이력서 · 5쪽",
			characterCount: 100,
		});
		expect(resume.debug).not.toHaveProperty("secret");
	});

	it("잘못된 선택적 개발 상세를 기존 준비 상태의 실패로 바꾸지 않는다", async () => {
		mockResumeResponse({
			...createResumeStatusBody(),
			debug: {
				page_count: -1,
				sections: [null, { document_id: "incomplete" }],
			},
		});
		const resume = await fetchDolmenResumeStatus();
		expect(resume.state).toBe("ready");
		if (resume.state === "ready") expect(resume.debug).toEqual({});
	});
});
