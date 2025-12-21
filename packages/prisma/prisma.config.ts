import * as dotenv from "dotenv";
import * as path from "path";
import { defineConfig, env } from "prisma/config";

// .env.local 파일 로드 (server 앱의 환경변수 사용)
const envPath = path.resolve(__dirname, "../../apps/server/.env.local");
dotenv.config({ path: envPath });

// 현재 디렉토리의 .env.local도 로드 (fallback)
dotenv.config({ path: path.resolve(__dirname, ".env.local") });
dotenv.config({ path: path.resolve(__dirname, ".env") });

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
  datasource: {
    url: env("DATABASE_URL"),
    // directUrl: env("DIRECT_URL"),
  },
});
