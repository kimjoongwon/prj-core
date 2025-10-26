import { Global, Module } from "@nestjs/common";
import { PrismaService } from "@shared";

@Global()
@Module({
	providers: [PrismaService],
	exports: [PrismaService],
})
export class PrismaModule {}
