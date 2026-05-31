import {
	CourseAggregateRoot,
	PaymentAggregateRoot,
	ReservationAggregateRoot,
} from "@cocrepo/aggregate";
import {} from "@cocrepo/aggregate";
import {
	CoursesRepository,
	PaymentsRepository,
	ReservationsRepository,
	TenantsRepository,
	TimelinesRepository,
} from "@cocrepo/repository";
import { AuthContext, SpaceContext } from "@cocrepo/service";
import { ReservationUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ReservationsController } from "./reservations.controller";

@Module({
	imports: [CqrsModule],
	controllers: [ReservationsController],
	providers: [
		ReservationAggregateRoot,
		CourseAggregateRoot,
		PaymentAggregateRoot,
		CoursesRepository,
		PaymentsRepository,
		ReservationsRepository,
		TenantsRepository,
		TimelinesRepository,
		AuthContext,
		SpaceContext,
		...ReservationUseCaseProviders,
	],
})
export class ReservationsModule {}
