import { RoleAggregateRoot } from "@cocrepo/aggregate";
import { RolesRepository } from "@cocrepo/repository";
import { RoleCommandHandlers, RoleQueryHandlers } from "@cocrepo/usecase";
import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { RolesController } from "./roles.controller";

@Module({
	imports: [CqrsModule],
	controllers: [RolesController],
	providers: [
		RoleAggregateRoot,
		RolesRepository,
		...RoleCommandHandlers,
		...RoleQueryHandlers,
	],
})
export class RolesModule {}
