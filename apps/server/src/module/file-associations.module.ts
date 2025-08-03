import { Module } from "@nestjs/common";
import {
	FileAssociationsController,
	FileAssociationsRepository,
	FileAssociationsService,
} from "@shared";

@Module({
	providers: [FileAssociationsService, FileAssociationsRepository],
	controllers: [FileAssociationsController],
})
export class FileAssociationsModule {}
