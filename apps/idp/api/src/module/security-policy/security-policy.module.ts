import { SecurityPoliciesRepository } from "@cocrepo/repository";
import { SecurityPolicyFacade } from "@cocrepo/facade";
import { Module } from "@nestjs/common";
import { SecurityPolicyController } from "./security-policy.controller";

@Module({
	controllers: [SecurityPolicyController],
	providers: [SecurityPolicyFacade, SecurityPoliciesRepository],
	exports: [SecurityPolicyFacade],
})
export class SecurityPolicyModule {}
