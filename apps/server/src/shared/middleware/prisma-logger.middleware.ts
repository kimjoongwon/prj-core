import { Prisma } from "@shared/schema";

export function loggingMiddleware(): Prisma.Middleware {
	return async (params, next) => {
		const before = Date.now();

		const result = await next(params);

		const after = Date.now();

		console.log(
			`쿼리 ${params.model}.${params.action} 실행 시간: ${after - before}ms`,
		);

		return result;
	};
}
