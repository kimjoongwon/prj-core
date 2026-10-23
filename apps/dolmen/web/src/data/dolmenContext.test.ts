// @vitest-environment node
import { describe, expect, it } from "vitest";
import { contextWireFixture } from "../test/dolmenFixtures";
import { parseDolmenContextSnapshot } from "./dolmenContext";

describe("GSSC 관측 계약", () => {
	it("앱 예산과 단계·제외 사유를 그대로 보관하며 원문 필드는 제외한다", () => {
		const wire = contextWireFixture();
		const context = parseDolmenContextSnapshot({
			...wire,
			raw_prompt: "비공개",
			packets: [
				...wire.packets,
				{
					packet_id: "query",
					kind: "query",
					source: "현재 질문",
					selected: true,
					reason: "required_query",
					estimated_tokens: 1,
					character_count: 1,
					snippet: "보관하면 안 되는 질문 원문",
				},
			],
		});
		expect(context).toMatchObject({
			revision: 7,
			status: "ready",
			budget: {
				inputLimit: 1000,
				outputReserve: 200,
				estimatedInputTokens: 700,
				remainingInputTokens: 300,
			},
			history: { droppedTurns: 1, deduplicatedTurns: 1 },
		});
		expect(context?.packets[2]).toMatchObject({
			selected: false,
			reason: "duplicate_history",
		});
		expect(context?.packets[3]).not.toHaveProperty("snippet");
		expect(context).not.toHaveProperty("raw_prompt");
	});
	it("추정 총량이 한도 이하여도 서버의 budget_exceeded를 유지한다", () => {
		expect(
			parseDolmenContextSnapshot({
				...contextWireFixture(),
				status: "budget_exceeded",
			})?.status,
		).toBe("budget_exceeded");
	});
	it.each([
		{ stages: [] },
		{ packets: [{ packet_id: "unknown" }] },
		{ budget: { input_limit: -1 } },
	])("잘못된 관측 자료는 미수신으로 처리한다 %#", (invalid) => {
		expect(
			parseDolmenContextSnapshot({ ...contextWireFixture(), ...invalid }),
		).toBeUndefined();
	});
});
