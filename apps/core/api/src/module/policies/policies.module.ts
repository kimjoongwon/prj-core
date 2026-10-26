import { PolicyAggregate } from "@cocrepo/aggregate";
import { SpaceContext } from "@cocrepo/context";
import { PoliciesController } from "@cocrepo/controller";
import { PoliciesRepository } from "@cocrepo/repository";
import { PolicyQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	controllers: [PoliciesController],
	providers: [
		PolicyAggregate,
		PoliciesRepository,
		SpaceContext,
		...PolicyQueryHandlers,
	],
})
export class PoliciesModule {}
