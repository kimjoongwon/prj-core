import { ReservationAggregate } from "@cocrepo/aggregate";
import { AuthContext, SpaceContext } from "@cocrepo/context";
import { ReservationsController } from "@cocrepo/controller";
import {
	ReservationsRepository,
	TenantsRepository,
	TimelinesRepository,
} from "@cocrepo/repository";
import { ReservationUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	controllers: [ReservationsController],
	providers: [
		ReservationAggregate,
		ReservationsRepository,
		TenantsRepository,
		TimelinesRepository,
		AuthContext,
		SpaceContext,
		...ReservationUseCaseProviders,
	],
})
export class ReservationsModule {}
