import type { PrismaClient } from "../generated/client/client";

type TenantScopeDbClient = PrismaClient;

type DbId = bigint;

/**
 * bootstrap 리소스 생성에 사용할 Tenant ID를 Space에서 해석합니다.
 *
 * 운영 리소스는 tenant-owned이지만 seed 정의는 여전히 FitnessCenter/Space를 business key로
 * 삼기 때문에, bootstrap 경계에서만 Space -> Tenant 변환을 수행합니다.
 */
export async function requireTenantIdForSpace(
	db: TenantScopeDbClient,
	spaceId: DbId,
	preferredUserId?: DbId | null,
): Promise<DbId> {
	const tenant = await db.tenant.findFirst({
		where: {
			space: { id: spaceId },
			removedAt: null,
			...(preferredUserId ? { user: { id: preferredUserId } } : {}),
		},
		orderBy: { createdAt: "asc" },
	});

	if (tenant) {
		return tenant.id;
	}

	const fallbackTenant = await db.tenant.findFirst({
		where: {
			space: { id: spaceId },
			removedAt: null,
		},
		orderBy: { createdAt: "asc" },
	});

	if (!fallbackTenant) {
		throw new Error(`Space에 연결된 Tenant를 찾을 수 없습니다: ${spaceId}`);
	}

	return fallbackTenant.id;
}
