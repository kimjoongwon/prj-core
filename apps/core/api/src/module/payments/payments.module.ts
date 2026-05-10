import { PaymentApplicationService } from "@cocrepo/app";
import { PaymentFacade } from "@cocrepo/facade";
import {
	CoursesRepository,
	PaymentsRepository,
	ReservationsRepository,
} from "@cocrepo/repository";
import { AuthContext, PaymentService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { PaymentsController } from "./payments.controller";

@Module({
	controllers: [PaymentsController],
	providers: [
		PaymentFacade,
		PaymentApplicationService,
		PaymentService,
		CoursesRepository,
		PaymentsRepository,
		ReservationsRepository,
		AuthContext,
		SpaceContext,
	],
	exports: [PaymentFacade, PaymentApplicationService],
})
export class PaymentsModule {}
