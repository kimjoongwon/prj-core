import { ColumnDefinitionsRepository } from "@cocrepo/repository";
import { ColumnDefinitionsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { ColumnsController } from "./columns.controller";

@Module({
	controllers: [ColumnsController],
	providers: [ColumnDefinitionsService, ColumnDefinitionsRepository],
	exports: [ColumnDefinitionsService],
})
export class ColumnsModule {}
