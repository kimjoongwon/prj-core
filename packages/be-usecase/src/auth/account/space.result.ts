import type { SpaceAggregate } from "@cocrepo/aggregate";

export type AuthSpaceResult = Awaited<
	ReturnType<SpaceAggregate["findByIdsWithGround"]>
>[number];
