import { ReservationFacade } from "@cocrepo/facade";
import {
	CoursesRepository,
	PaymentsRepository,
	ReservationsRepository,
	TenantsRepository,
	TimelinesRepository,
} from "@cocrepo/repository";
import {
	AuthContext,
	CourseService,
	PaymentService,
	ReservationService,
	SpaceContext,
} from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { ReservationsController } from "./reservations.controller";

@Module({
	controllers: [ReservationsController],
	providers: [
		ReservationFacade,
		ReservationService,
		CourseService,
		PaymentService,
		CoursesRepository,
		PaymentsRepository,
		ReservationsRepository,
		TenantsRepository,
		TimelinesRepository,
		AuthContext,
		SpaceContext,
	],
	exports: [ReservationFacade],
})
export class ReservationsModule {}
