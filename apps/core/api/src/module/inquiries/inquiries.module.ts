import { InquiryAggregate } from "@cocrepo/aggregate";
import { AuthContext, SpaceContext } from "@cocrepo/context";
import { InquiriesController } from "@cocrepo/controller";
import { InquiriesRepository } from "@cocrepo/repository";
import { InquiryCommandHandlers, InquiryQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { InquiriesGateway } from "./gateways/inquiries.gateway";

@Module({
	imports: [CqrsModule],
	controllers: [InquiriesController],
	providers: [
		InquiryAggregate,
		InquiriesRepository,
		AuthContext,
		SpaceContext,
		InquiriesGateway,
		...InquiryCommandHandlers,
		...InquiryQueryHandlers,
	],
})
export class InquiriesModule {}
