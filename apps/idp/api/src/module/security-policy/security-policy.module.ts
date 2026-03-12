import { SecurityPoliciesRepository } from "@cocrepo/repository";
import { SecurityPolicyApplicationService } from "@cocrepo/app";
import { Module } from "@nestjs/common";
import { SecurityPolicyController } from "./security-policy.controller";

@Module({
	controllers: [SecurityPolicyController],
	providers: [SecurityPolicyApplicationService, SecurityPoliciesRepository],
	exports: [SecurityPolicyApplicationService],
})
export class SecurityPolicyModule {}
