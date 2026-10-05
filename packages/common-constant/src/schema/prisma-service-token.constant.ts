/**
 * Prisma 서비스 의존성 주입 토큰
 * NestJS 의존성 주입에서 Prisma 클라이언트 인스턴스를 식별하기 위한 심볼
 */
export const PRISMA_SERVICE_TOKEN = Symbol("PRISMA_SERVICE");
