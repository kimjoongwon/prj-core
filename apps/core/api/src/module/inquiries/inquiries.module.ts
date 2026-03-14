import { InquiryFacade } from "@cocrepo/facade";
import { InquiriesRepository } from "@cocrepo/repository";
import { AuthContext, InquiryService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { InquiriesGateway } from "./gateways/inquiries.gateway";
import { InquiriesController } from "./inquiries.controller";

@Module({
	imports: [],
	controllers: [InquiriesController],
	providers: [
		InquiryFacade,
		InquiryService,
		InquiriesRepository,
		AuthContext,
		SpaceContext,
		InquiriesGateway,
	],
	exports: [InquiryFacade],
})
export class InquiriesModule {}
