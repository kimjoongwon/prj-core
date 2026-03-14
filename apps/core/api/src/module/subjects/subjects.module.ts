import { SubjectFacade } from "@cocrepo/facade";
import { SubjectsRepository } from "@cocrepo/repository";
import { SubjectService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { SubjectsController } from "./subjects.controller";

@Module({
	providers: [SubjectFacade, SubjectService, SubjectsRepository],
	controllers: [SubjectsController],
	exports: [SubjectFacade],
})
export class SubjectsModule {}
