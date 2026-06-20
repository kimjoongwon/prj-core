import { runBootstrap } from "../bootstrap/run-bootstrap";
import type { PrismaClient } from "../generated/client/client";
import { assertE2eSeedContract } from "./assert-e2e-seed-contract";

export async function runE2eSeed(prisma: PrismaClient): Promise<void> {
	await runBootstrap(prisma);
	await assertE2eSeedContract(prisma);
}
