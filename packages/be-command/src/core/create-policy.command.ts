import type { CreatePolicyDto } from "@cocrepo/dto";

export class CreatePolicyCommand {
	constructor(readonly dto: CreatePolicyDto) {}
}
