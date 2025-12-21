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
// Re-export everything from generated Prisma client
// ============================================================================

export * from "../generated/client/client";

// ============================================================================
// Type Utilities
// ============================================================================

/** 기본 엔티티 인터페이스 */
export interface BaseEntity {
  id: string;
  seq: number;
  createdAt: Date;
  updatedAt?: Date | null;
  removedAt?: Date | null;
}

/** ID 필드 제외 */
export type WithoutId<T> = Omit<T, "id">;

/** 타임스탬프 필드 제외 */
export type WithoutTimestamps<T> = Omit<
  T,
  "createdAt" | "updatedAt" | "removedAt"
>;

/** 생성 입력 타입 */
export type CreateInput<T> = WithoutId<WithoutTimestamps<T>>;

/** 수정 입력 타입 */
export type UpdateInput<T> = Partial<WithoutTimestamps<T>>;
