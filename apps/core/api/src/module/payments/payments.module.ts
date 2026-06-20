import { PaymentAggregate } from "@cocrepo/aggregate";
import { SpaceContext } from "@cocrepo/context";
import { PaymentsController } from "@cocrepo/controller";
import { PaymentsRepository } from "@cocrepo/repository";
import { PaymentCommandHandlers, PaymentQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

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
