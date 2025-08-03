import { Module } from "@nestjs/common";
import {
	RoutinesController,
	RoutinesRepository,
	RoutinesService,
} from "@shared";

@Module({
	controllers: [RoutinesController],
	providers: [RoutinesService, RoutinesRepository],
})
export class RoutinesModule {}
