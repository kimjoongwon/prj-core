import { RoutinesRepository } from "@cocrepo/repository";
import { RoutinesService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { RoutinesController } from "@shared";

@Module({
	controllers: [RoutinesController],
	providers: [RoutinesService, RoutinesRepository],
})
export class RoutinesModule {}
