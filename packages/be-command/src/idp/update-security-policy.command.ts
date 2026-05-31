import type { UpdateSecurityPolicyDto } from "@cocrepo/dto";

export class UpdateSecurityPolicyCommand {
	constructor(readonly dto: UpdateSecurityPolicyDto) {}
}
