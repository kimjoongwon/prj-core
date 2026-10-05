import "./src/load-env";

import { runBootstrap } from "./src/bootstrap/run-bootstrap";
import { runE2eSeed } from "./src/e2e/run-e2e-seed";
import {
	createPrismaClient,
	disconnectPrismaClient,
} from "./src/prisma-client";

function getSeedRunner() {
	if (
		!process.env.PRISMA_SEED_PROFILE ||
		process.env.PRISMA_SEED_PROFILE === "bootstrap"
	) {
		return runBootstrap;
	}

	if (process.env.PRISMA_SEED_PROFILE === "e2e") {
		return runE2eSeed;
	}

	throw new Error(
		`Unsupported PRISMA_SEED_PROFILE: ${process.env.PRISMA_SEED_PROFILE}`,
	);
}

// `seed.ts` is intentionally thin: env loading, client lifecycle, and the
// bootstrap orchestration entrypoint stay separated so the actual seed logic
// lives under `src/bootstrap/**`.
const prismaHandle = createPrismaClient();

getSeedRunner()(prismaHandle.prisma)
	.then(async () => {
		await disconnectPrismaClient(prismaHandle);
	})
	.catch(async (error) => {
		console.error(error);
		await disconnectPrismaClient(prismaHandle);
		process.exit(1);
	});
