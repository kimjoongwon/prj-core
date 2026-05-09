import { ReservationFacade } from "@cocrepo/facade";
import {
	CoursesRepository,
	ReservationsRepository,
	TenantsRepository,
} from "@cocrepo/repository";
import {
	AuthContext,
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
		CoursesRepository,
		ReservationsRepository,
		TenantsRepository,
		AuthContext,
		SpaceContext,
	],
	exports: [ReservationFacade],
})
export class ReservationsModule {}
