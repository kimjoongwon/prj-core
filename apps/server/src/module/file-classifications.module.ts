import { FileClassificationsRepository } from "@cocrepo/repository";
import { FileClassificationsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { FileClassificationsController } from "@shared";

@Module({
	controllers: [FileClassificationsController],
	providers: [FileClassificationsService, FileClassificationsRepository],
})
export class FileClassificationsModule {}
