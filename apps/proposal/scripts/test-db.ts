import { createPlan, getDb, getPlanTree, initializeDb } from "../src/lib/db";

async function main() {
	console.log("🗄️  데이터베이스 테스트 시작...");

	// DB 초기화
	await initializeDb();

	const db = getDb();

	// 데이터 쓰기
	const testData = {
		id: `test-${Date.now()}`,
		title: "테스트 문서",
		description: "데이터베이스 연결 테스트입니다.",
		type: "document",
		sortOrder: 0,
	};

	console.log("\n📝 데이터 쓰기:", testData);
	await createPlan(testData);

	// 데이터 읽기
	console.log("\n📖 전체 트리 조회:");
	const tree = await getPlanTree(null);
	console.log(JSON.stringify(tree, null, 2));

	// 특정 ID로 조회
	console.log("\n📖 특정 ID로 조회:", testData.id);
	const plan = await db.execute({
		sql: `SELECT * FROM plans WHERE id = ?`,
		args: [testData.id],
	});
	console.log(JSON.stringify(plan.rows[0], null, 2));

	console.log("\n✅ 테스트 완료!");
}

main().catch((error) => {
	console.error("❌ 에러:", error);
	process.exit(1);
});
