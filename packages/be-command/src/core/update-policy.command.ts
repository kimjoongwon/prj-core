import type { UpdatePolicyDto } from "@cocrepo/dto";

export class UpdatePolicyCommand {
	constructor(
		readonly policyId: string,
		readonly dto: UpdatePolicyDto,
	) {}
}
