import { PaymentAggregate } from "@cocrepo/aggregate";
import { PaymentsRepository } from "@cocrepo/repository";
import { SpaceContext } from "@cocrepo/service";
import { PaymentCommandHandlers, PaymentQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PaymentsController } from "@cocrepo/controller";

@Module({
	imports: [CqrsModule],
	controllers: [PaymentsController],
	providers: [
		PaymentAggregate,
		PaymentsRepository,
		SpaceContext,
		...PaymentCommandHandlers,
		...PaymentQueryHandlers,
	],
})
export class PaymentsModule {}
