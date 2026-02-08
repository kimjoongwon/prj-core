import { AuthCacheService, RedisService } from "@cocrepo/service";
import { Global, Module } from "@nestjs/common";

@Global()
@Module({
	providers: [RedisService, AuthCacheService],
	exports: [RedisService, AuthCacheService],
})
export class RedisModule {}
