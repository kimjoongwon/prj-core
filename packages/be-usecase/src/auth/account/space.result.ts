import type { SpaceAggregate } from "@cocrepo/aggregate";

type SpaceWithGroundResult = Awaited<
	ReturnType<SpaceAggregate["findByIdsWithGround"]>
>[number];

export type AuthSpaceResult = SpaceWithGroundResult & {
	tenantId?: string | null;
};
