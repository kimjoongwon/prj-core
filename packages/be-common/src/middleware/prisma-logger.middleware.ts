import { Prisma } from "@cocrepo/prisma";

// Prisma 7: Middleware is deprecated, use client extensions instead
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function loggingExtension(): ReturnType<typeof Prisma.defineExtension> {
	return Prisma.defineExtension({
		name: "logging",
		query: {
			async $allOperations({ operation, model, args, query }) {
				const before = Date.now();
				const result = await query(args);
				const after = Date.now();

				console.log(
					`쿼리 ${model}.${operation} 실행 시간: ${after - before}ms`,
				);

				return result;
			},
		},
	});
}
