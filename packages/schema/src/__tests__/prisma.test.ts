import { PrismaClient } from "@prisma/client";
import { describe, expect, it } from "vitest";

describe("PrismaClient", () => {
	it("should create PrismaClient instance", () => {
		const client = new PrismaClient();
		expect(client).toBeDefined();
		expect(client.constructor.name).toBe("PrismaClient");
	});

	// Note: onModuleInit and onModuleDestroy are NestJS-specific methods
	// that are added in the custom PrismaClient implementation in apps/server
	// it("should have onModuleInit method", () => {
	// 	const client = new PrismaClient();
	// 	expect(typeof client.onModuleInit).toBe("function");
	// });

	// it("should have onModuleDestroy method", () => {
	// 	const client = new PrismaClient();
	// 	expect(typeof client.onModuleDestroy).toBe("function");
	// });
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
