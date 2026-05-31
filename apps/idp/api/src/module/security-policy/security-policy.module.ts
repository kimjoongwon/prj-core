import { SecurityPoliciesRepository } from "@cocrepo/repository";
import { SecurityPolicyAggregateRoot } from "@cocrepo/aggregate";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { SecurityPolicyController } from "./security-policy.controller";
import { SecurityPolicyUseCaseProviders } from "@cocrepo/usecase";

@Module({
	imports: [CqrsModule],
	controllers: [SecurityPolicyController],
	providers: [
		...SecurityPolicyUseCaseProviders,
		SecurityPolicyAggregateRoot,
		SecurityPoliciesRepository,
	],
})
export class SecurityPolicyModule {}
