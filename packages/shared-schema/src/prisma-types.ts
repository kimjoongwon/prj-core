// Manual re-export of Prisma types for better build compatibility
// This avoids bundling issues with generated Prisma Client

// Re-export Prisma namespace, enums, and client - tsup will mark generated/client as external
export type {
	$Enums,
	Prisma,
} from "../generated/client";

export { PrismaClient } from "../generated/client";

// Utility type for Prisma Client instance
export type PrismaClientInstance = import("../generated/client").PrismaClient;
