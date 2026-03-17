import { securityPolicySeedData } from "../../bootstrap/defaults";
import type { PrismaClient } from "../generated/client/client";
import { Prisma } from "../generated/client/client";

type DbClient = PrismaClient | Prisma.TransactionClient;

export async function ensureSecurityPolicyDefaults(
	db: DbClient,
): Promise<void> {
	const existingPolicy = await db.securityPolicy.findUnique({
		where: { key: securityPolicySeedData.key },
	});

	if (existingPolicy) {
		console.log("⏭️ SecurityPolicy 기본 정책 이미 존재 (스킵)");
		return;
	}

	await db.securityPolicy.create({
		data: securityPolicySeedData,
	});
	console.log("✅ SecurityPolicy 기본 정책 생성 완료!");
}
