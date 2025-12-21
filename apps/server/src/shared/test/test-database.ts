import { execSync } from "node:child_process";
import { existsSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import { PrismaClient } from "@cocrepo/prisma";

export class TestDatabase {
  private static instance: TestDatabase;
  private prisma: InstanceType<typeof PrismaClient>;
  private dbPath: string;

  private constructor() {
    this.dbPath = join(process.cwd(), "test.db");

    // Prisma 7: Set DATABASE_URL environment variable before creating client
    process.env.DATABASE_URL = "file:./test.db";

    // Prisma 7 requires options object
    this.prisma = new PrismaClient({} as any);
  }

  public static getInstance(): TestDatabase {
    if (!TestDatabase.instance) {
      TestDatabase.instance = new TestDatabase();
    }
    return TestDatabase.instance;
  }

  public getPrismaClient(): PrismaClient {
    return this.prisma;
  }

  public async setup(): Promise<void> {
    try {
      // Clean up existing test database
      await this.cleanup();

      // Run migrations for test database
      execSync(
        "cd ../../../packages/shared-prisma && npx prisma migrate deploy",
        {
          env: { ...process.env, DATABASE_URL: "file:./test.db" },
          stdio: "inherit",
        }
      );

      // Connect to database
      await this.prisma.$connect();
    } catch (error) {
      console.error("Failed to setup test database:", error);
      throw error;
    }
  }

  public async cleanup(): Promise<void> {
    try {
      // Disconnect from database
      await this.prisma.$disconnect();

      // Remove test database file
      if (existsSync(this.dbPath)) {
        unlinkSync(this.dbPath);
      }
    } catch (error) {
      console.error("Failed to cleanup test database:", error);
    }
  }

  public async seed(): Promise<void> {
    try {
      // Add test data seeding logic here
      // This is a placeholder - you should implement actual seeding logic
      console.log("Test database seeded successfully");
    } catch (error) {
      console.error("Failed to seed test database:", error);
      throw error;
    }
  }

  public async clearAllTables(): Promise<void> {
    try {
      // Get all table names (this is a simplified example)
      const tables = [
        "User",
        "Tenant",
        "Space",
        "Ground",
        "Role",
        "Category",
        "Exercise",
        "Program",
        "Routine",
        "Session",
        "Assignment",
        "Timeline",
        "Subject",
        "Group",
        "File",
        // Add other table names as needed
      ];

      // Clear all tables in the correct order (to handle foreign key constraints)
      for (const table of tables.reverse()) {
        try {
          await this.prisma.$executeRawUnsafe(`DELETE FROM "${table}"`);
        } catch (error) {
          // Table might not exist or might be empty, continue
          console.warn(`Could not clear table ${table}:`, error);
        }
      }
    } catch (error) {
      console.error("Failed to clear test database tables:", error);
      throw error;
    }
  }
}
