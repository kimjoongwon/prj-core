import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PRISMA_SERVICE_TOKEN } from "@cocrepo/repository";
import { createPrismaClient, PrismaService } from "@shared";

@Global()
@Module({
	imports: [ConfigModule],
	providers: [
		// Factory 패턴으로 PrismaService 직접 제공 (adapter 포함)
		{
			provide: PrismaService,
			useFactory: createPrismaClient,
			inject: [ConfigService],
		},
		// Repository 패키지를 위한 Token Provider
		{
			provide: PRISMA_SERVICE_TOKEN,
			useExisting: PrismaService,
		},
	],
	exports: [PrismaService, PRISMA_SERVICE_TOKEN],
})
export class PrismaModule {}
