import { Module } from "@nestjs/common";
import { globalModules } from "./global.module";
import { InteractionModule } from "./interaction/interaction.module";
import { OidcModule } from "./oidc/oidc.module";
import { PasswordResetModule } from "./password-reset/password-reset.module";
import { PrismaModule } from "./prisma.module";
import { RedisModule } from "./redis.module";

@Module({
	imports: [
		...globalModules,
		PrismaModule,
		RedisModule,
		OidcModule,
		InteractionModule,
		PasswordResetModule,
	],
})
export class AppModule {}
