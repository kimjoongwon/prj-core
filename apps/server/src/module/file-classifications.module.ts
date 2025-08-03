import { Module } from "@nestjs/common";
import {
	FileClassificationsController,
	FileClassificationsRepository,
	FileClassificationsService,
} from "@shared";

@Module({
	controllers: [FileClassificationsController],
	providers: [FileClassificationsService, FileClassificationsRepository],
})
export class FileClassificationsModule {}
