import { ProgramsRepository } from "@cocrepo/repository";
import { ProgramsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { ProgramsController } from "@shared";

@Module({
	controllers: [ProgramsController],
	providers: [ProgramsService, ProgramsRepository],
})
export class ProgramsModule {}
