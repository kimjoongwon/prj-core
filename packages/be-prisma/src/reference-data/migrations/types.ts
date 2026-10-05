import type { Prisma, PrismaClient } from "../../generated/client/client";

export type ReferenceDataDbClient = PrismaClient | Prisma.TransactionClient;

export interface ReferenceDataMigration {
	id: string;
	description: string;
	sourcePath: string;
	up(db: ReferenceDataDbClient): Promise<void>;
}
