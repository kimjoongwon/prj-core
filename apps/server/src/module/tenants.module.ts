import { Module } from "@nestjs/common";
import {
	ContextService,
	TenantsController,
	TenantsRepository,
	TenantsService,
} from "@shared";

@Module({
	controllers: [TenantsController],
	providers: [TenantsService, TenantsRepository, ContextService],
})
export class TenantsModule {}
