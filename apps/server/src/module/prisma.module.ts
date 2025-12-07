import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PrismaService } from "@shared";
import { createPrismaClient } from "@shared";

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
	],
	exports: [PrismaService],
})
export class PrismaModule {}
