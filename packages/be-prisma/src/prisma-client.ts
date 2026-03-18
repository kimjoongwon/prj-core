import { PrismaPg } from "@prisma/adapter-pg";
import * as pg from "pg";

import { PrismaClient } from "./generated/client/client";

export interface PrismaClientHandle {
	pool: pg.Pool;
	prisma: PrismaClient;
}

/**
 * CLI/seed 스크립트에서 공통으로 쓰는 Prisma client 묶음을 생성합니다.
 *
 * app runtime과 달리 여기서는 adapter/pool 수명주기를 스크립트가 직접 관리하므로,
 * Prisma client만 반환하지 않고 pool까지 함께 묶어 돌려줍니다.
 */
export function createPrismaClient(
	connectionString = process.env.DATABASE_URL,
): PrismaClientHandle {
	if (!connectionString) {
		throw new Error("DATABASE_URL is not set.");
	}

	// CLI scripts use the adapter directly so we keep connection setup in one
	// place instead of repeating Pool + PrismaPg wiring in each entrypoint.
	const pool = new pg.Pool({
		connectionString,
	});
	const adapter = new PrismaPg(pool);
	const prisma = new PrismaClient({ adapter });

	return { pool, prisma };
}

/**
 * createPrismaClient()가 연 리소스를 안전하게 종료합니다.
 *
 * Prisma -> pg pool 순서로 닫아야 in-flight query가 정리된 뒤 소켓이 종료됩니다.
 */
export async function disconnectPrismaClient(
	handle: PrismaClientHandle,
): Promise<void> {
	// Shut Prisma down first so in-flight queries settle before the pg pool
	// itself is terminated.
	await handle.prisma.$disconnect();
	await handle.pool.end();
}
