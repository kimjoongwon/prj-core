import { FilesRepository } from "@cocrepo/repository";
import { FilesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { FilesController } from "@shared";

@Module({
	controllers: [FilesController],
	providers: [FilesService, FilesRepository],
})
export class FilesModule {}
