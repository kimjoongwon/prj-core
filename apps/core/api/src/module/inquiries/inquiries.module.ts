import { InquiryAggregateRoot } from "@cocrepo/aggregate";
import { InquiriesRepository } from "@cocrepo/repository";
import { AuthContext, SpaceContext } from "@cocrepo/service";
import { InquiryCommandHandlers, InquiryQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { InquiriesGateway } from "./gateways/inquiries.gateway";
import { InquiriesController } from "./inquiries.controller";

@Module({
	imports: [CqrsModule],
	controllers: [InquiriesController],
	providers: [
		InquiryAggregateRoot,
		InquiriesRepository,
		AuthContext,
		SpaceContext,
		InquiriesGateway,
		...InquiryCommandHandlers,
		...InquiryQueryHandlers,
	],
})
export class InquiriesModule {}
