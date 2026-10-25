import { describe, expect, it, vi } from "vitest";
import { memberAbilitySeedData } from "../definitions/abilities";
import { syncIdentityReferenceCatalogMigration } from "./20261025000000_sync_identity_reference_catalog";

describe("sync identity reference catalog migration", () => {
	it("reconciles only the frozen ability predicates and obsolete translation key", async () => {
		const abilityUpdates: unknown[] = [];
		const translationDeletes: unknown[] = [];
		const db = {
			ability: {
				updateMany: vi.fn(async (args: unknown) => {
					abilityUpdates.push(args);
					return { count: 1 };
				}),
			},
			translation: {
				deleteMany: vi.fn(async (args: unknown) => {
					translationDeletes.push(args);
				}),
			},
		};
		const migration = syncIdentityReferenceCatalogMigration;
		expect(migration?.id).toBe("20261025000000-sync-identity-reference-catalog");

		await migration?.up(db as never);
		await migration?.up(db as never);

		expect(abilityUpdates).toEqual([
		{
			where: { name: "Can 조회 사용자" },
			data: { conditions: { id: "${user.id}" } },
		},
		{
			where: { name: "Can 수정 사용자" },
			data: { conditions: { id: "${user.id}" } },
		},
		{
			where: { name: "Can 조회 예약" },
			data: { conditions: { userSeq: "${user.seq}" } },
		},
		{
			where: { name: "Can 수정 예약" },
			data: { conditions: { userSeq: "${user.seq}" } },
		},
		{
			where: { name: "Can 조회 사용자" },
			data: { conditions: { id: "${user.id}" } },
		},
		{
			where: { name: "Can 수정 사용자" },
			data: { conditions: { id: "${user.id}" } },
		},
		{
			where: { name: "Can 조회 예약" },
			data: { conditions: { userSeq: "${user.seq}" } },
		},
		{
			where: { name: "Can 수정 예약" },
			data: { conditions: { userSeq: "${user.seq}" } },
		},
		]);
		expect(translationDeletes).toEqual([
			{ where: { key: { in: ["오노라 계정 센터"] } } },
			{ where: { key: { in: ["오노라 계정 센터"] } } },
		]);
		const memberConditions = memberAbilitySeedData
			.filter(
				(ability) =>
					ability.subject === "entity:User" &&
					(ability.actionName === "read" || ability.actionName === "update"),
			)
			.map((ability) => ability.conditions);
		expect(memberConditions).toEqual([
			{ id: "${user.id}" },
			{ id: "${user.id}" },
		]);
		const reservationConditions = memberAbilitySeedData
			.filter(
				(ability) =>
					ability.subject === "entity:Reservation" &&
					(ability.actionName === "read" || ability.actionName === "update"),
			)
			.map((ability) => ability.conditions);
		expect(reservationConditions).toEqual([
			{ userSeq: "${user.seq}" },
			{ userSeq: "${user.seq}" },
		]);
	});
});
