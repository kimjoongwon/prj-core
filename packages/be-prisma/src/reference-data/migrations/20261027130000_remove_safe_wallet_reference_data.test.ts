import { describe, expect, it, vi } from "vitest";
import { removeSafeWalletReferenceData } from "./20261027130000_remove_safe_wallet_reference_data";

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

describe("removeSafeWalletReferenceData", () => {
	it("deletes only the three wallet subjects and their graph in FK order", async () => {
		const db = createDb([{ id: 1n }, { id: 2n }], [{ id: 10n }, { id: 11n }]);
		await removeSafeWalletReferenceData.up(db as never);
		expect(db.calls).toEqual(["policyEntry", "ability", "subject"]);
		expect(db.subject.findMany).toHaveBeenCalledWith({
			where: {
				name: {
					in: [
						"menu:wallets",
						"menu:wallets:list",
						"menu:wallets:transactions",
					],
				},
			},
			select: { id: true },
		});
		expect(db.ability.findMany).toHaveBeenCalledWith({
			where: { subjectId: { in: [1n, 2n] } },
			select: { id: true },
		});
		expect(db.policyEntry.deleteMany).toHaveBeenCalledWith({
			where: { abilityId: { in: [10n, 11n] } },
		});
		expect(db.ability.deleteMany).toHaveBeenCalledWith({
			where: { id: { in: [10n, 11n] } },
		});
		expect(db.subject.deleteMany).toHaveBeenCalledWith({
			where: { id: { in: [1n, 2n] } },
		});
	});

	it("is safe when no subjects or abilities remain", async () => {
		const db = createDb([], []);
		await removeSafeWalletReferenceData.up(db as never);
		await removeSafeWalletReferenceData.up(db as never);
		expect(db.calls).toEqual([]);
		expect(db.ability.findMany).not.toHaveBeenCalled();
	});

	it("deletes subjects with no abilities without issuing child deletes", async () => {
		const db = createDb([{ id: 1n }], []);
		await removeSafeWalletReferenceData.up(db as never);
		expect(db.calls).toEqual(["subject"]);
		expect(db.policyEntry.deleteMany).not.toHaveBeenCalled();
		expect(db.ability.deleteMany).not.toHaveBeenCalled();
	});
});
