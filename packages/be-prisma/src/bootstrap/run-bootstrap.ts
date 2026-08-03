import type { PrismaClient } from "../generated/client/client";
import { SYSTEM_SPACE_ULID } from "../reference-data/constants";
import { syncReferenceData } from "../reference-data/sync-reference-data";
import { createAssetDomainData } from "./asset";
import { ensureSecurityPolicyDefaults } from "./defaults";
import { createInquiryDomainData } from "./inquiry";
import {
	classifyFitnessCenterSpacesAsBranch,
	createHierarchicalTenants,
	createRegularUsersAndFitnessCenters,
	ensureSystemBootstrap,
} from "./system-space";
import { ensureBootstrapTemplates } from "./templates";
import { createTimelineSessionExerciseDomainData } from "./timeline";

/**
 * 로컬/dev/stg bootstrap 전체 흐름을 실행합니다.
 *
 * 순서는 임의가 아닙니다. 앞 단계가 만든 역할/space/tenant/fitness center를 뒷단 도메인 seed가
 * 참조하므로, 이 orchestration이 사실상 bootstrap의 계약 역할을 합니다.
 */
export async function runBootstrap(prisma: PrismaClient): Promise<void> {
	// The order here is intentional:
	// 1) reference/system primitives
	// 2) user/fitness center seeds
	// 3) branch classification + domain demo data that depends on those primitives
	const systemBootstrap = await ensureSystemBootstrap(prisma);

	await createRegularUsersAndFitnessCenters(
		prisma,
		systemBootstrap.companyManagerRole,
	);
	await classifyFitnessCenterSpacesAsBranch(prisma, SYSTEM_SPACE_ULID);
	await createHierarchicalTenants(prisma, SYSTEM_SPACE_ULID);
	await syncReferenceData(prisma);
	await createTimelineSessionExerciseDomainData(prisma);
	await ensureSecurityPolicyDefaults(prisma);
	await createAssetDomainData(prisma);
	await ensureBootstrapTemplates(prisma);
	await createInquiryDomainData(prisma);

	console.log(
		`Bootstrap 완료 (superAdminUserId=${systemBootstrap.superAdminUser.id})`,
	);
}
