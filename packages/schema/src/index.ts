export { Prisma, PrismaClient } from "@prisma/client";

// Common database operations
export interface BaseEntity {
  id: string;
  seq: number;
  createdAt: Date;
  updatedAt?: Date | null;
  removedAt?: Date | null;
}

// Type utilities for Prisma models
export type WithoutId<T> = Omit<T, "id">;
export type WithoutTimestamps<T> = Omit<
  T,
  "createdAt" | "updatedAt" | "removedAt"
>;
export type CreateInput<T> = WithoutId<WithoutTimestamps<T>>;
export type UpdateInput<T> = Partial<WithoutTimestamps<T>>;
