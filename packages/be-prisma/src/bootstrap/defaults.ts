import type { PrismaClient } from "../generated/client/client";
import { Prisma } from "../generated/client/client";
import { securityPolicySeedData } from "./data/defaults";

type DbClient = PrismaClient | Prisma.TransactionClient;

/**
 * 기본 보안 정책 레코드를 한 번만 생성합니다.
 *
 * bootstrap 기본값이므로 이미 값이 존재하면 덮어쓰지 않고 운영자 수정 상태를 존중합니다.
 */
export async function ensureSecurityPolicyDefaults(
	db: DbClient,
): Promise<void> {
	// Security policy is treated as a bootstrap default, not reference data:
	// create once, then leave operator-managed changes alone.
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
