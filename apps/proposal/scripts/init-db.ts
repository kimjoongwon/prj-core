import { initializeDb, getDb, createPlan } from "../src/lib/db";

async function main() {
  console.log("Initializing database...");

  await initializeDb();

  // 샘플 데이터 생성 (선택)
  const db = getDb();
  const existing = await db.execute(
    "SELECT COUNT(*) as count FROM plans"
  );

  if (Number(existing.rows[0].count) === 0) {
    console.log("Creating sample data...");

    // 루트 폴더
    await createPlan({
      id: "root-1",
      title: "프로젝트 기획",
      type: "folder",
      sortOrder: 0,
    });

    // 하위 항목들
    await createPlan({
      id: "req-1",
      parentId: "root-1",
      title: "요구사항 정의",
      type: "document",
      description: "프로젝트의 핵심 요구사항을 정의합니다.",
      sortOrder: 0,
    });

    await createPlan({
      id: "design-1",
      parentId: "root-1",
      title: "화면 설계",
      type: "folder",
      sortOrder: 1,
    });

    await createPlan({
      id: "design-1-1",
      parentId: "design-1",
      title: "메인 화면",
      type: "document",
      data: {
        wireframe: "figma-link-here",
        status: "draft",
      },
      sortOrder: 0,
    });

    console.log("Sample data created!");
  }

  console.log("Database ready!");
}

main().catch(console.error);
