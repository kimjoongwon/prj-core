import { GroundsRepository } from "@cocrepo/repository";
import { GroundsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { GroundsController } from "./grounds.controller";

@Module({
	providers: [GroundsService, GroundsRepository],
	controllers: [GroundsController],
	exports: [GroundsService],
})
export class GroundsModule {}
