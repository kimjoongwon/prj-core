import { type DynamicModule, Module } from "@nestjs/common";
import { RedisThrottlerStorage } from "./redis-throttler-storage";

@Module({})
export class RedisThrottlerStorageModule {}

export const redisThrottlerStorageModule: DynamicModule = {
	module: RedisThrottlerStorageModule,
	providers: [RedisThrottlerStorage],
	exports: [RedisThrottlerStorage],
};
