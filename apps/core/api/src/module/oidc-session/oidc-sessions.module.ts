import { OidcSessionAggregate } from "@cocrepo/aggregate";
import { OidcSessionUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { OidcSessionsController } from "@cocrepo/controller";

@Module({
	imports: [CqrsModule],
	controllers: [OidcSessionsController],
	providers: [...OidcSessionUseCaseProviders, OidcSessionAggregate],
})
export class OidcSessionsModule {}
