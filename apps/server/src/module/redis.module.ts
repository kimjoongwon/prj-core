import { Global, Module } from "@nestjs/common";
import { RedisService } from "@shared";

@Global()
@Module({
	providers: [RedisService],
	exports: [RedisService],
})
export class RedisModule {}
