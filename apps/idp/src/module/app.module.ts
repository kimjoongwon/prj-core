import { Module } from "@nestjs/common";
import { globalModules } from "./global.module";
import { InteractionModule } from "./interaction/interaction.module";
import { OidcModule } from "./oidc/oidc.module";
import { PrismaModule } from "./prisma.module";
import { RedisModule } from "./redis.module";

@Module({
	imports: [
		...globalModules,
		PrismaModule,
		RedisModule,
		OidcModule,
		InteractionModule,
	],
})
export class AppModule {}
