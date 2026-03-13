import { UpdateSecurityPolicyDto } from "@cocrepo/dto";
import { SecurityPolicy } from "@cocrepo/entity";
import { SecurityPolicyService } from "@cocrepo/service";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SecurityPolicyFacade {
	constructor(private readonly securityPolicyService: SecurityPolicyService) {}

	getDefault(): Promise<SecurityPolicy> {
		return this.securityPolicyService.getDefault();
	}

	update(dto: UpdateSecurityPolicyDto): Promise<SecurityPolicy> {
		return this.securityPolicyService.update(dto);
	}
}
