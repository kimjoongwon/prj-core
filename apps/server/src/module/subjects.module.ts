import { SubjectsRepository } from "@cocrepo/repository";
import { SubjectsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { SubjectsController } from "@shared";

@Module({
	controllers: [SubjectsController],
	providers: [SubjectsService, SubjectsRepository],
})
export class SubjectsModule {}
