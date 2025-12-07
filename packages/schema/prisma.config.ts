import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  // Multi-file schema configuration
  // Points to schema directory containing modular .prisma files
  schema: "./prisma/schema",

  // 마이그레이션 설정
  migrations: {
    path: "./prisma/migrations",
    seed: "tsx ./prisma/seed.ts",
  },

  // 데이터소스 설정
  datasource: {
    url: env("DATABASE_URL"),
    // directUrl: env("DIRECT_URL"),
  },
});
