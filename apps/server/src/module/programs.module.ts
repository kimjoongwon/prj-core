import { Module } from "@nestjs/common";
import {
	ProgramsController,
	ProgramsRepository,
	ProgramsService,
} from "@shared";

@Module({
	controllers: [ProgramsController],
	providers: [ProgramsService, ProgramsRepository],
})
export class ProgramsModule {}
