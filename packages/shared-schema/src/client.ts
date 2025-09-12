// Export Prisma Client from local generated client
// This ensures Docker caching works properly by keeping client in package

// Re-export commonly used types for convenience
export type {} from // Prisma model types will be available after generation
"../generated/client";
export { $Enums, Prisma, PrismaClient } from "../generated/client";
