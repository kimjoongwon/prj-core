import { PRISMA_SERVICE_TOKEN } from "@cocrepo/constant";
import { createPrismaClient } from "@cocrepo/service";
import { Global, Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({
	providers: [
		{
			provide: PRISMA_SERVICE_TOKEN,
			useFactory: createPrismaClient,
			inject: [ConfigService],
		},
	],
	exports: [PRISMA_SERVICE_TOKEN],
})
export class PrismaModule implements OnModuleInit {
	private readonly logger = new Logger(PrismaModule.name);

	onModuleInit() {
		this.logger.log("PrismaModule initialized successfully");
	}
}
