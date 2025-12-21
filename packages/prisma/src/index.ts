/**
 * @cocrepo/prisma
 *
 * Prisma 데이터베이스 패키지
 * PrismaClient, 모든 모델 타입, enum, Prisma 유틸리티를 export합니다.
 *
 * @example
 * // PrismaClient 사용
 * import { PrismaClient } from '@cocrepo/prisma'
 * const prisma = new PrismaClient()
 *
 * // 모델 타입 사용
 * import type { User, Tenant, Space } from '@cocrepo/prisma'
 *
 * // Enum 사용
 * import { CategoryTypes, Roles } from '@cocrepo/prisma'
 *
 * // Prisma 유틸리티 사용
 * import { Prisma } from '@cocrepo/prisma'
 */

// ============================================================================
// Re-export from @prisma/client
// ============================================================================
export * from "../generated/client/client";
