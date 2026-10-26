import type { SpaceAggregate } from "@cocrepo/aggregate";

type SpaceWithFitnessCenterResult = Awaited<
	ReturnType<SpaceAggregate["findByIdsWithFitnessCenter"]>
>[number];

export type AuthSpaceResult = SpaceWithFitnessCenterResult & {
	tenantId?: bigint | null;
};
