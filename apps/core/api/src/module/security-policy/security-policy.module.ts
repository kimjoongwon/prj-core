import { SecurityPolicyAggregate } from "@cocrepo/aggregate";
import { SecurityPoliciesRepository } from "@cocrepo/repository";
import { SecurityPolicyUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { SecurityPolicyController } from "@cocrepo/controller";

@Module({
	imports: [CqrsModule],
	controllers: [SecurityPolicyController],
	providers: [
		...SecurityPolicyUseCaseProviders,
		SecurityPolicyAggregate,
		SecurityPoliciesRepository,
	],
})
export class SecurityPolicyModule {}
