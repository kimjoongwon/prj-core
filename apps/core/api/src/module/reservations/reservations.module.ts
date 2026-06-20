import {
	CourseAggregate,
	PaymentAggregate,
	ReservationAggregate,
} from "@cocrepo/aggregate";
import { ReservationsController } from "@cocrepo/controller";
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

@Module({
	imports: [CqrsModule],
	controllers: [ReservationsController],
	providers: [
		ReservationAggregate,
		CourseAggregate,
		PaymentAggregate,
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
