import { PRISMA_SERVICE_TOKEN } from "@cocrepo/constant";
import {
	createPrismaClient,
	PrismaService,
} from "@cocrepo/service";
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
		{
			provide: PrismaService,
			useExisting: PRISMA_SERVICE_TOKEN,
		},
	],
	exports: [PRISMA_SERVICE_TOKEN, PrismaService],
})
export class PrismaModule implements OnModuleInit {
	private readonly logger = new Logger(PrismaModule.name);

	onModuleInit() {
		this.logger.log("PrismaModule initialized successfully");
	}
}
