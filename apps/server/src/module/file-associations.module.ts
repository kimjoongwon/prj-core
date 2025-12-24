import { FileAssociationsRepository } from "@cocrepo/repository";
import { FileAssociationsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { FileAssociationsController } from "@shared";

@Module({
	providers: [FileAssociationsService, FileAssociationsRepository],
	controllers: [FileAssociationsController],
})
export class FileAssociationsModule {}
