import { SecurityPolicyFacade } from "@cocrepo/facade";
import { SecurityPoliciesRepository } from "@cocrepo/repository";
import { SecurityPolicyService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { SecurityPolicyController } from "./security-policy.controller";

@Module({
	controllers: [SecurityPolicyController],
	providers: [
		SecurityPolicyFacade,
		SecurityPolicyService,
		SecurityPoliciesRepository,
	],
	exports: [SecurityPolicyFacade],
})
export class SecurityPolicyModule {}
