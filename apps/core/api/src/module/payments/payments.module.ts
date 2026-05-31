import { PaymentsRepository } from "@cocrepo/repository";
import { PaymentAggregateRoot } from "@cocrepo/aggregate";
import { SpaceContext } from "@cocrepo/service";
import { PaymentCommandHandlers, PaymentQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { PaymentsController } from "./payments.controller";

@Module({
	imports: [CqrsModule],
	controllers: [PaymentsController],
	providers: [
		PaymentAggregateRoot,
		PaymentsRepository,
		SpaceContext,
		...PaymentCommandHandlers,
		...PaymentQueryHandlers,
	],
})
export class PaymentsModule {}
