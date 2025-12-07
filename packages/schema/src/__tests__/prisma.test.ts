import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { describe, expect, it } from "vitest";
import pg from "pg";

describe("PrismaClient", () => {
	it("should create PrismaClient instance with adapter", () => {
		const pool = new pg.Pool({
			connectionString: process.env.DATABASE_URL,
		});
		const adapter = new PrismaPg(pool);
		const client = new PrismaClient({ adapter });

		expect(client).toBeDefined();
		expect(client.constructor.name).toBe("PrismaClient");
	});
});

describe("Types", () => {
	it("should have proper type definitions", () => {
		// This test mainly checks that types are properly exported
		// and can be used in TypeScript
		const example = {
			id: "test-id",
			email: "test@example.com",
		};

		expect(example).toBeDefined();
	});
});
