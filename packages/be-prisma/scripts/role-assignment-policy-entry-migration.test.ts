import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const migrationSql = readFileSync(
	resolve(
		process.cwd(),
		"migrations/20260726120000_role_assignment_policy_entry/migration.sql",
	),
	"utf8",
);

describe("RoleAssignment·PolicyEntry migration", () => {
	it("기존 테이블을 삭제하지 않고 새 이름으로 변경해야 한다", () => {
		expect(migrationSql).toContain(
			'ALTER TABLE "role_policies" RENAME TO "role_assignments"',
		);
		expect(migrationSql).toContain(
			'ALTER TABLE "policy_abilities" RENAME TO "policy_entries"',
		);
		expect(migrationSql).not.toMatch(/\bDROP\s+TABLE\b/i);
	});

	it("PK·FK·unique·index 이름을 모두 새 테이블 이름으로 변경해야 한다", () => {
		for (const name of [
			"role_assignments_pkey",
			"role_assignments_role_id_policy_id_key",
			"role_assignments_role_id_idx",
			"role_assignments_policy_id_idx",
			"role_assignments_is_active_idx",
			"role_assignments_role_id_fkey",
			"role_assignments_policy_id_fkey",
			"policy_entries_pkey",
			"policy_entries_policy_id_ability_id_key",
			"policy_entries_policy_id_idx",
			"policy_entries_ability_id_idx",
			"policy_entries_policy_id_fkey",
			"policy_entries_ability_id_fkey",
		]) {
			expect(migrationSql).toContain(`"${name}"`);
		}
	});
});
