import { SecurityPoliciesRepository } from "@cocrepo/repository";
import { SecurityPolicyService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { SecurityPolicyController } from "./security-policy.controller";

@Module({
	controllers: [SecurityPolicyController],
	providers: [SecurityPolicyService, SecurityPoliciesRepository],
	exports: [SecurityPolicyService],
})
export class SecurityPolicyModule {}
