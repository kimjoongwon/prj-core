import { RoleAggregate } from "@cocrepo/aggregate";
import { RolesRepository } from "@cocrepo/repository";
import { RoleCommandHandlers, RoleQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { RolesController } from "@cocrepo/controller";

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
