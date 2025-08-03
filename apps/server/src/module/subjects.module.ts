import { Module } from "@nestjs/common";
import {
	SubjectsController,
	SubjectsRepository,
	SubjectsService,
} from "@shared";

@Module({
	controllers: [SubjectsController],
	providers: [SubjectsService, SubjectsRepository],
})
export class SubjectsModule {}
