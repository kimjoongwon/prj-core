import { OidcSessionAggregateRoot } from "@cocrepo/aggregate";
import { OidcSessionUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { OidcSessionsController } from "./oidc-sessions.controller";

@Module({
	imports: [CqrsModule],
	controllers: [OidcSessionsController],
	providers: [...OidcSessionUseCaseProviders, OidcSessionAggregateRoot],
})
export class OidcSessionsModule {}
