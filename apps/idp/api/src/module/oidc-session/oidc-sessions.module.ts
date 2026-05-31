import { OidcSessionAggregateRoot } from "@cocrepo/aggregate";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { OidcSessionsController } from "./oidc-sessions.controller";
import { OidcSessionUseCaseProviders } from "@cocrepo/usecase";

@Module({
	imports: [CqrsModule],
	controllers: [OidcSessionsController],
	providers: [...OidcSessionUseCaseProviders, OidcSessionAggregateRoot],
})
export class OidcSessionsModule {}
