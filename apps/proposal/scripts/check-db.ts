import { getDb, getPlanTree } from "../src/lib/db";

async function main() {
	const db = getDb();

	// 테이블 목록 확인
	const tables = await db.execute(`
    SELECT name FROM sqlite_master WHERE type='table' ORDER BY name
  `);
	console.log(
		"Tables:",
		tables.rows.map((r) => r.name),
	);

	// 루트 계획 조회
	console.log("\n--- Root Plans ---");
	const rootPlans = await getPlanTree(null);
	console.log(rootPlans);

	// 전체 계획 조회
	console.log("\n--- All Plans ---");
	const allPlans = await db.execute("SELECT * FROM plans");
	for (const plan of allPlans.rows) {
		console.log(
			`- [${plan.type}] ${plan.title} (parent: ${plan.parent_id || "ROOT"})`,
		);
	}
}

main().catch(console.error);
