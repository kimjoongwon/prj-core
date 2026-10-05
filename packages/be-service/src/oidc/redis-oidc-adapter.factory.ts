import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis/redis.service";
import { RedisOidcAdapter } from "./oidc.adapter";
import type { OidcAdapter } from "./types";

@Injectable()
export class RedisOidcAdapterFactory {
	constructor(private readonly redisService: RedisService) {}

	getAdapterFactory(): (modelType: string) => OidcAdapter {
		return (modelType: string) =>
			new RedisOidcAdapter(modelType, this.redisService);
	}
}
