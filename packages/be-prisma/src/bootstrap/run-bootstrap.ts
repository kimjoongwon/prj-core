import type { PrismaClient } from "../generated/client/client";
import { SYSTEM_SPACE_ID } from "../reference-data/constants";
import { createAssetDomainData } from "./asset";
import { ensureSecurityPolicyDefaults } from "./defaults";
import { createInquiryDomainData } from "./inquiry";
import { createMobileReservationDemoData } from "./mobile-reservation-demo";
import {
	classifyGroundSpacesAsBranch,
	createHierarchicalTenants,
	createRegularUsersAndGrounds,
	ensureSystemBootstrap,
} from "./system-space";
import { ensureBootstrapTemplates } from "./templates";
import { createTimelineSessionExerciseDomainData } from "./timeline";

/**
 * 로컬/dev/stg bootstrap 전체 흐름을 실행합니다.
 *
 * 순서는 임의가 아닙니다. 앞 단계가 만든 역할/space/tenant/ground를 뒷단 도메인 seed가
 * 참조하므로, 이 orchestration이 사실상 bootstrap의 계약 역할을 합니다.
 */
export async function runBootstrap(prisma: PrismaClient): Promise<void> {
	// The order here is intentional:
	// 1) reference/system primitives
	// 2) user/ground seeds
	// 3) branch classification + domain demo data that depends on those primitives
	const systemBootstrap = await ensureSystemBootstrap(prisma);

	await createRegularUsersAndGrounds(prisma, systemBootstrap.manageRole);
	await classifyGroundSpacesAsBranch(prisma, SYSTEM_SPACE_ID);
	await createHierarchicalTenants(prisma, SYSTEM_SPACE_ID);
	await createTimelineSessionExerciseDomainData(prisma);
	await createMobileReservationDemoData(prisma);
	await ensureSecurityPolicyDefaults(prisma);
	await createAssetDomainData(prisma);
	await ensureBootstrapTemplates(prisma);
	await createInquiryDomainData(prisma);

	console.log({ superAdminUser: systemBootstrap.superAdminUser });
}
