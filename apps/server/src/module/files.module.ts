import { Module } from "@nestjs/common";
import { FilesController, FilesRepository, FilesService } from "@shared";

@Module({
	controllers: [FilesController],
	providers: [FilesService, FilesRepository],
})
export class FilesModule {}
