import { PolicyAggregate } from "@cocrepo/aggregate";
import {
	CreatePolicyDto,
	SyncPolicyAbilitiesDto,
	UpdatePolicyDto,
} from "@cocrepo/dto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PolicyFacade {
	constructor(private readonly policyService: PolicyAggregate) {}

	listPolicies(): Promise<unknown> {
		return this.policyService.listPolicies();
	}

	getPolicyById(policyId: string): Promise<unknown> {
		return this.policyService.getPolicyById(policyId);
	}

	createPolicy(dto: CreatePolicyDto): Promise<unknown> {
		return this.policyService.createPolicy(dto);
	}

	updatePolicy(policyId: string, dto: UpdatePolicyDto): Promise<unknown> {
		return this.policyService.updatePolicy(policyId, dto);
	}

	deletePolicy(policyId: string): Promise<unknown> {
		return this.policyService.deletePolicy(policyId);
	}

	syncPolicyAbilities(
		policyId: string,
		abilityIds: SyncPolicyAbilitiesDto["abilityIds"],
	): Promise<unknown> {
		return this.policyService.syncPolicyAbilities(policyId, abilityIds);
	}
}
