import { PrismaClient } from "@cocrepo/prisma";
import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import { PrismaService } from "./prisma.service";

export function createPrismaClient(
	configService: ConfigService,
): PrismaService {
	const logger = new Logger("PrismaFactory");

	try {
		logger.log("PrismaClient 생성 시작...");

		const databaseUrl = configService.get<string>("DATABASE_URL");
		logger.debug(`DATABASE_URL: ${databaseUrl ? "설정됨" : "설정 안됨"}`);

		if (!databaseUrl) {
			const error = new Error(
				"DATABASE_URL is not defined in environment variables",
			);
			logger.error(error.message);
			throw error;
		}

		logger.log("PostgreSQL connection pool 생성 중...");
		// PostgreSQL connection pool 생성
		const pool = new pg.Pool({
			connectionString: databaseUrl,
			max: 20, // 최대 연결 수
			idleTimeoutMillis: 30000,
			connectionTimeoutMillis: 2000,
		});

		logger.log("Prisma PostgreSQL Adapter 생성 중...");
		// Prisma PostgreSQL Adapter 생성
		const adapter = new PrismaPg(pool);

		logger.log("PrismaClient 인스턴스 생성 중...");
		// PrismaService (extends PrismaClient) 생성 및 반환
		const prismaClient = new PrismaClient({
			adapter,
			log:
				configService.get<string>("NODE_ENV") === "development"
					? ["query", "error", "warn"]
					: ["error"],
		}) as PrismaService;

		logger.log("PrismaClient 생성 완료!");
		return prismaClient;
	} catch (error) {
		logger.error("PrismaClient 생성 중 에러 발생:", error);
		throw error;
	}
}
