import { InquiriesApplicationService } from "@cocrepo/app";
import { InquiriesRepository } from "@cocrepo/repository";
import { AuthContext, InquiriesService, SpaceContext } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { InquiriesGateway } from "./gateways/inquiries.gateway";
import { InquiriesController } from "./inquiries.controller";

@Module({
	imports: [],
	controllers: [InquiriesController],
	providers: [
		InquiriesApplicationService,
		InquiriesService,
		InquiriesRepository,
		AuthContext,
		SpaceContext,
		InquiriesGateway,
	],
	exports: [InquiriesApplicationService],
})
export class InquiriesModule {}
