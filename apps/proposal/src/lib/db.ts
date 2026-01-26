import { createClient, type Client } from "@libsql/client";
import path from "node:path";

// DB 파일 경로 (프로젝트 내부 data 폴더)
const DB_PATH =
  process.env.TURSO_DATABASE_URL ||
  `file:${path.join(process.cwd(), "data", "proposal.db")}`;

let client: Client | null = null;

export function getDb(): Client {
  if (!client) {
    client = createClient({
      url: DB_PATH,
      authToken: process.env.TURSO_AUTH_TOKEN, // 클라우드 사용 시
    });
  }
  return client;
}

// 스키마 초기화
export async function initializeDb(): Promise<void> {
  const db = getDb();

  // 기획 트리 테이블
  await db.execute(`
    CREATE TABLE IF NOT EXISTS plans (
      id TEXT PRIMARY KEY,
      parent_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      type TEXT DEFAULT 'folder',
      data JSON,
      sort_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (parent_id) REFERENCES plans(id) ON DELETE CASCADE
    )
  `);

  // 요구사항 테이블
  await db.execute(`
    CREATE TABLE IF NOT EXISTS requirements (
      id TEXT PRIMARY KEY,
      plan_id TEXT,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'draft',
      data JSON,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE SET NULL
    )
  `);

  // AI 대화 히스토리 (나중에 벡터 검색 확장 가능)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS chat_history (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      metadata JSON,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // 인덱스 생성
  await db.execute(
    `CREATE INDEX IF NOT EXISTS idx_plans_parent ON plans(parent_id)`
  );
  await db.execute(
    `CREATE INDEX IF NOT EXISTS idx_requirements_plan ON requirements(plan_id)`
  );
  await db.execute(
    `CREATE INDEX IF NOT EXISTS idx_chat_session ON chat_history(session_id)`
  );

  console.log("Database initialized successfully");
}

// 트리 조회 헬퍼
export async function getPlanTree(parentId: string | null = null) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT * FROM plans WHERE parent_id ${parentId ? "= ?" : "IS NULL"} ORDER BY sort_order`,
    args: parentId ? [parentId] : [],
  });
  return result.rows;
}

// 단일 조회
export async function getPlanById(id: string) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT * FROM plans WHERE id = ?`,
    args: [id],
  });
  return result.rows[0] || null;
}

// 생성
export async function createPlan(plan: {
  id: string;
  parentId?: string | null;
  title: string;
  description?: string;
  type?: string;
  data?: Record<string, unknown>;
  sortOrder?: number;
}) {
  const db = getDb();
  await db.execute({
    sql: `INSERT INTO plans (id, parent_id, title, description, type, data, sort_order)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [
      plan.id,
      plan.parentId || null,
      plan.title,
      plan.description || null,
      plan.type || "folder",
      plan.data ? JSON.stringify(plan.data) : null,
      plan.sortOrder || 0,
    ],
  });
}

// 수정
export async function updatePlan(
  id: string,
  updates: Partial<{
    title: string;
    description: string;
    type: string;
    data: Record<string, unknown>;
    sortOrder: number;
  }>
) {
  const db = getDb();
  const setClauses: string[] = [];
  const args: (string | number | null)[] = [];

  if (updates.title !== undefined) {
    setClauses.push("title = ?");
    args.push(updates.title);
  }
  if (updates.description !== undefined) {
    setClauses.push("description = ?");
    args.push(updates.description);
  }
  if (updates.type !== undefined) {
    setClauses.push("type = ?");
    args.push(updates.type);
  }
  if (updates.data !== undefined) {
    setClauses.push("data = ?");
    args.push(JSON.stringify(updates.data));
  }
  if (updates.sortOrder !== undefined) {
    setClauses.push("sort_order = ?");
    args.push(updates.sortOrder);
  }

  setClauses.push("updated_at = datetime('now')");
  args.push(id);

  await db.execute({
    sql: `UPDATE plans SET ${setClauses.join(", ")} WHERE id = ?`,
    args,
  });
}

// 삭제
export async function deletePlan(id: string) {
  const db = getDb();
  await db.execute({
    sql: `DELETE FROM plans WHERE id = ?`,
    args: [id],
  });
}
