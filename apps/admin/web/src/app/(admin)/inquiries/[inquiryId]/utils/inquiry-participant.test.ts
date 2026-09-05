import type { GetInquiryParticipantsQueryResult } from "@cocrepo/api/core/inquiries";
import { describe, expect, it } from "vitest";
import { toInquiryParticipantState } from "./inquiry-participant";

const joinedAt = new Date("2026-09-05T01:00:00.000Z");
const participantResponse = {
	id: BigInt("9007199254740993"),
	inquiryId: BigInt("101"),
	threadId: BigInt("9007199254740994"),
	userId: BigInt("9007199254740995"),
	role: "CUSTOMER",
	isOnline: true,
	isTyping: false,
	unreadCount: 3,
	joinedAt,
	lastSeenAt: new Date("2026-09-05T01:01:00.000Z"),
	lastReadAt: new Date("2026-09-05T01:02:00.000Z"),
	leftAt: new Date("2026-09-05T01:03:00.000Z"),
	createdAt: joinedAt,
	updatedAt: null,
	removedAt: null,
} satisfies NonNullable<GetInquiryParticipantsQueryResult["data"]>[number];

describe("문의 참여자 응답 변환", () => {
	it("SDK bigint ID의 정밀도와 Date를 화면 상태에 보존한다", () => {
		expect(toInquiryParticipantState(participantResponse, "101")).toEqual({
			id: "9007199254740993",
			inquiryId: "101",
			threadId: "9007199254740994",
			userId: "9007199254740995",
			role: "CUSTOMER",
			isOnline: true,
			isTyping: false,
			unreadCount: 3,
			joinedAt: "2026-09-05T01:00:00.000Z",
			lastSeenAt: "2026-09-05T01:01:00.000Z",
			lastReadAt: "2026-09-05T01:02:00.000Z",
			leftAt: "2026-09-05T01:03:00.000Z",
		});
		expect(participantResponse.id).toBe(BigInt("9007199254740993"));
		expect(participantResponse.joinedAt).toBe(joinedAt);
	});

	it.each([null, undefined])(
		"threadId가 %s이면 선택 ID와 비어 있는 날짜를 null로 유지한다",
		(threadId) => {
			const participantState = toInquiryParticipantState(
				{
					...participantResponse,
					threadId,
					lastSeenAt: null,
					lastReadAt: null,
					leftAt: null,
				},
				"101",
			);

			expect(participantState.threadId).toBeNull();
			expect(participantState.lastSeenAt).toBeNull();
			expect(participantState.lastReadAt).toBeNull();
			expect(participantState.leftAt).toBeNull();
		},
	);

	it.each([
		["CUSTOMER", "CUSTOMER"],
		["AGENT", "AGENT"],
		["SUPERVISOR", "SUPERVISOR"],
		["VIEWER", "AGENT"],
	] as const)("%s 역할의 기존 화면 표현 %s를 유지한다", (role, expectedRole) => {
		expect(
			toInquiryParticipantState({ ...participantResponse, role }, "101").role,
		).toBe(expectedRole);
	});
});
