import { SecurityPolicyAggregate } from "@cocrepo/aggregate";
import { SecurityPolicyController } from "@cocrepo/controller";
import { SecurityPoliciesRepository } from "@cocrepo/repository";
import { SecurityPolicyUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

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
