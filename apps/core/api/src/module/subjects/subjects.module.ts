import { SubjectsApplicationService } from "@cocrepo/app";
import { SubjectsRepository } from "@cocrepo/repository";
import { SubjectsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { SubjectsController } from "./subjects.controller";

@Module({
	providers: [SubjectsApplicationService, SubjectsService, SubjectsRepository],
	controllers: [SubjectsController],
	exports: [SubjectsApplicationService],
})
export class SubjectsModule {}
