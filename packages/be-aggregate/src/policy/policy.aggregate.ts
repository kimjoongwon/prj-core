import { USER_ERRORS } from "@cocrepo/constant";
import { SpaceContext } from "@cocrepo/context";
import { Policy } from "@cocrepo/entity";
import { PoliciesRepository } from "@cocrepo/repository";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class PolicyAggregate {
	constructor(
		private readonly policiesRepository: PoliciesRepository,
		private readonly spaceContext: SpaceContext,
	) {}

	async listPolicies(): Promise<Policy[]> {
		const spaceId = this.requireSpaceId();
		return this.policiesRepository.findManyBySpaceId(spaceId);
	}

	private requireSpaceId(): bigint {
		const spaceId = this.spaceContext.spaceId;
		if (!spaceId) {
			throw new UnauthorizedException(USER_ERRORS.SPACE_NOT_SELECTED);
		}
		return spaceId;
	}
}
