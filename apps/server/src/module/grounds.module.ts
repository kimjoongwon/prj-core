import { GroundsRepository } from "@cocrepo/repository";
import { GroundsService } from "@cocrepo/service";
import { Module } from "@nestjs/common";
import { GroundsController } from "@shared";
import { PrismaModule } from "./prisma.module";

@Module({
	imports: [PrismaModule],
	controllers: [GroundsController],
	providers: [GroundsService, GroundsRepository],
})
export class GroundsModule {}
