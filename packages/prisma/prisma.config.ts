import * as path from "node:path";
import * as dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

// .env.local 파일 로드
// 환경별 변수: DATABASE_URL, DATABASE_URL_STG, DATABASE_URL_PROD 등
dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, ".env.local") });

export default defineConfig({
	// Multi-file schema configuration
	// Points to schema directory containing modular .prisma files
	schema: "./schema",

	// 마이그레이션 설정
	migrations: {
		path: "./migrations",
		seed: "tsx ./seed.ts",
	},

	// 데이터소스 설정
	// cross-env로 설정된 DATABASE_URL 환경 변수 사용
	// - 기본값: .env.local의 DATABASE_URL
	// - stg: cross-env로 DATABASE_URL_STG → DATABASE_URL로 매핑
	// - prod: cross-env로 DATABASE_URL_PROD → DATABASE_URL로 매핑
	datasource: {
		url: env("DATABASE_URL"),
		directUrl: env("DIRECT_URL"),
	},
});
