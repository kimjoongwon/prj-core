import { SubjectsRepository } from "@cocrepo/repository";
import { SubjectsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { SubjectsController } from "./subjects.controller";

@Module({
	providers: [SubjectsService, SubjectsRepository],
	controllers: [SubjectsController],
	exports: [SubjectsService],
})
export class SubjectsModule {}
