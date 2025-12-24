import type { PrismaClient } from "@cocrepo/prisma";

/**
 * PrismaClient 타입 인터페이스
 * Repository에서 DI를 통해 주입받는 Prisma 클라이언트의 타입
 */
export type IPrismaClient = PrismaClient;
