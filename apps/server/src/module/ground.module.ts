import { Module } from "@nestjs/common";
import { GroundsController, GroundsRepository, GroundsService } from "@shared";

@Module({
	controllers: [GroundsController],
	providers: [GroundsService, GroundsRepository],
})
export class GroundsModule {}
