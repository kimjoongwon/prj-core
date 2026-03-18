import "./src/load-env";

import { runBootstrap } from "./src/bootstrap/run-bootstrap";
import {
	createPrismaClient,
	disconnectPrismaClient,
} from "./src/prisma-client";

// `seed.ts` is intentionally thin: env loading, client lifecycle, and the
// bootstrap orchestration entrypoint stay separated so the actual seed logic
// lives under `src/bootstrap/**`.
const prismaHandle = createPrismaClient();

runBootstrap(prismaHandle.prisma)
	.then(async () => {
		await disconnectPrismaClient(prismaHandle);
	})
	.catch(async (error) => {
		console.error(error);
		await disconnectPrismaClient(prismaHandle);
		process.exit(1);
	});
