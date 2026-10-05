import { RoleAggregate } from "@cocrepo/aggregate";
import { RolesController } from "@cocrepo/controller";
import { RolesRepository } from "@cocrepo/repository";
import { RoleCommandHandlers, RoleQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
	imports: [CqrsModule],
	controllers: [RolesController],
	providers: [
		RoleAggregate,
		RolesRepository,
		...RoleCommandHandlers,
		...RoleQueryHandlers,
	],
})
export class RolesModule {}
