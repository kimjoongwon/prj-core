import { SubjectsRepository } from "@cocrepo/repository";
import {
	ConstantSyncService,
	SubjectsService,
	SubjectSyncService,
} from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { SubjectsController } from "./subjects.controller";

@Module({
	controllers: [SubjectsController],
	providers: [
		SubjectsService,
		SubjectSyncService,
		ConstantSyncService,
		SubjectsRepository,
	],
	exports: [SubjectSyncService, ConstantSyncService],
})
export class SubjectsModule {}
