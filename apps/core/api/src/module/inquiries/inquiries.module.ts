import {
	InquiriesRepository,
	InquiryMessagesRepository,
	InquiryParticipantsRepository,
	InquiryThreadsRepository,
} from "@cocrepo/repository";
import {
	InquiriesService,
	InquiryMessagesService,
	InquiryParticipantsService,
} from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { InquiriesController } from "./controllers/inquiries.controller";
import { InquiriesGateway } from "./gateways/inquiries.gateway";

@Module({
	imports: [],
	controllers: [InquiriesController],
	providers: [
		// Services
		InquiriesService,
		InquiryMessagesService,
		InquiryParticipantsService,
		// Repositories
		InquiriesRepository,
		InquiryMessagesRepository,
		InquiryParticipantsRepository,
		InquiryThreadsRepository,
		// Gateways
		InquiriesGateway,
	],
	exports: [
		InquiriesService,
		InquiryMessagesService,
		InquiryParticipantsService,
	],
})
export class InquiriesModule {}
