import { describe, expect, it, vi } from "vitest";
import { removeTenantAccessRequestReferenceData } from "./20261101130000_remove_tenant_access_request_reference_data";

function createDb(subjects: { id: bigint }[], abilities: { id: bigint }[]) {
	const calls: string[] = [];
	return {
		calls,
		subject: {
			findMany: vi.fn(async () => subjects),
			deleteMany: vi.fn(async () => calls.push("subject")),
		},
		ability: {
			findMany: vi.fn(async () => abilities),
			deleteMany: vi.fn(async () => calls.push("ability")),
		},
		policyEntry: {
			deleteMany: vi.fn(async () => calls.push("policyEntry")),
		},
	};
}

describe("removeTenantAccessRequestReferenceData", () => {
	it("TenantAccessRequest subject와 권한 그래프만 FK 순서로 삭제한다", async () => {
		const db = createDb([{ id: 1n }], [{ id: 10n }, { id: 11n }]);
		await removeTenantAccessRequestReferenceData.up(db as never);

		expect(db.calls).toEqual(["policyEntry", "ability", "subject"]);
		expect(db.subject.findMany).toHaveBeenCalledWith({
			where: { name: { in: ["TenantAccessRequest"] } },
			select: { id: true },
		});
		expect(db.ability.findMany).toHaveBeenCalledWith({
			where: { subjectId: { in: [1n] } },
			select: { id: true },
		});
		expect(db.policyEntry.deleteMany).toHaveBeenCalledWith({
			where: { abilityId: { in: [10n, 11n] } },
		});
		expect(db.ability.deleteMany).toHaveBeenCalledWith({
			where: { id: { in: [10n, 11n] } },
		});
		expect(db.subject.deleteMany).toHaveBeenCalledWith({
			where: { id: { in: [1n] } },
		});
	});

	it("대상 subject가 없으면 재실행해도 안전하다", async () => {
		const db = createDb([], []);
		await removeTenantAccessRequestReferenceData.up(db as never);
		await removeTenantAccessRequestReferenceData.up(db as never);

		expect(db.calls).toEqual([]);
		expect(db.ability.findMany).not.toHaveBeenCalled();
	});

	it("ability가 없는 subject도 자식 delete 없이 제거한다", async () => {
		const db = createDb([{ id: 1n }], []);
		await removeTenantAccessRequestReferenceData.up(db as never);

		expect(db.calls).toEqual(["subject"]);
		expect(db.policyEntry.deleteMany).not.toHaveBeenCalled();
		expect(db.ability.deleteMany).not.toHaveBeenCalled();
	});
});
