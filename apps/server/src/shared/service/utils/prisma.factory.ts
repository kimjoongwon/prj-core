import "dotenv/config";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@cocrepo/schema";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaService } from "./prisma.service";

export function createPrismaClient(
	configService: ConfigService,
): PrismaService {
	const databaseUrl = configService.get<string>("DATABASE_URL");

	if (!databaseUrl) {
		throw new Error("DATABASE_URL is not defined in environment variables");
	}

	// PostgreSQL connection pool 생성
	const pool = new pg.Pool({
		connectionString: databaseUrl,
		max: 20, // 최대 연결 수
		idleTimeoutMillis: 30000,
		connectionTimeoutMillis: 2000,
	});

	// Prisma PostgreSQL Adapter 생성
	const adapter = new PrismaPg(pool);

	// PrismaService (extends PrismaClient) 생성 및 반환
	return new PrismaClient({
		adapter,
		log:
			configService.get<string>("NODE_ENV") === "development"
				? ["query", "error", "warn"]
				: ["error"],
	}) as PrismaService;
}
