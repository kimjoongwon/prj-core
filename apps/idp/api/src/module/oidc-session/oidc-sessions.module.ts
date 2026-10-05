import { OidcSessionAggregate } from "@cocrepo/aggregate";
import { OidcSessionsController } from "@cocrepo/controller";
import { OidcSessionUseCaseProviders } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	controllers: [OidcSessionsController],
	providers: [...OidcSessionUseCaseProviders, OidcSessionAggregate],
})
export class OidcSessionsModule {}
